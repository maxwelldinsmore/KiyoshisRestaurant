import {LineChart, PieChart, BarChart} from 'react-chartkick'
import 'chartkick/chart.js'
import {useEffect, useState} from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Reports() {
    const [salesData, setSalesData] = useState({})
    const [bestItem, setBestItem] = useState({})
    const [inventoryData, setInventoryData] = useState({})
    const [expiringData, setExpiringData] = useState([])
    const [topCustomers, setTopCustomers] = useState([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {

        setMounted(true)
        const fetchReports = async () => {
            try {

                const salesRes = await fetch('/api/orders?report=sales_by_day')

                if (!salesRes.ok) {
                    throw new Error(`Sales API error: ${salesRes.status}`)
                }
                const salesJson = await salesRes.json()

                if (!salesJson.data) {
                    console.error("Invalid sales response:", salesJson)
                    return
                }

                const salesFormatted = {}
                salesJson.data.forEach(row => {
                    salesFormatted[row.order_date] = Number(row.total_sales)
                })
                setSalesData(salesFormatted)

                const bestRes = await fetch('/api/orders?report=best_selling')

                if (!bestRes.ok) {
                    throw new Error(`Best Selling API error: ${bestRes.status}`)
                }
                const bestJson = await bestRes.json()

                if (!bestJson.data) {
                    console.error("Invalid best selling items response:", bestJson)
                    return
                }

                const bestFormatted = (bestJson.data || []).map(item => [
                    item.menu_item_name,
                    Number(item.total_sold)
                ])
                setBestItem(bestFormatted)

                const inventoryRes = await fetch('/api/inventory?report=low_stock')

                if (!inventoryRes.ok) {
                    throw new Error(`Low inventory stock API error: ${inventoryRes.status}`)
                }

                const inventoryJson = await inventoryRes.json()

                if (!inventoryJson.data) {
                    console.error("Invalid low inventory stock response:", inventoryJson)
                    return
                }

                const inventoryFormatted = inventoryJson.data.map(item => [
                    `Item ${item.inventory_item_id}`,
                    Number(item.quantity_available)
                ])
                setInventoryData(inventoryFormatted)

                const expiringRes = await fetch('/api/inventory?report=expiring')

                if (!expiringRes.ok) {
                    throw new Error(`Expiring items API error: ${expiringRes.status}`)
                }
                const expiringJson = await expiringRes.json()

                if (!expiringJson.data) {
                    console.error("Invalid expiring items response:", expiringJson)
                    return
                }

                const expiringFormatted = (expiringJson.data || []).map(item => [
                    item.menu_item_name || `Item ${item.inventory_item_id}`,
                    new Date(item.expiry_date).toLocaleDateString()
                ])

                setExpiringData(expiringFormatted)

                const topRes = await fetch('/api/orders?report=top_customers')

                if (!topRes.ok) {
                    throw new Error(`Top customers API error: ${topRes.status}`)
                }
                const topJson = await topRes.json()

                if (!topJson.data) {
                    console.error("Invalid top customers response:", topJson)
                    return
                }

                setTopCustomers(topJson.data || [])

            } catch (error) {
                console.error('Error loading reports:', error)
            }
        }
        fetchReports()
    }, [])

    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">
                            Reports Dashboard
                        </h1>
                        <Link href="/admin/dashboard">
                            <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                                Back to Dashboard
                            </button>
                        </Link>
                    </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    <div className="bg-white p-4 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-3">
                            Sales Over Time
                        </h2>
                        {mounted && (
                            <LineChart
                                data={salesData}
                                xtitle="Date"
                                ytitle="Revenue"
                                prefix="$"
                                curve={false}
                            />
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-3">
                            Best Selling Items
                        </h2>
                        {mounted && (
                            <BarChart data={bestItem}/>
                        )}
                    </div>

                </div>

                {/* Lists Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Expiring Soon */}
                    <div className="bg-white p-4 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-3">
                            Expiring Soon
                        </h2>

                        {expiringData.length === 0 ? (
                            <p className="text-gray-500">No items expiring soon</p>
                        ) : (
                            <ul className="space-y-2">
                                {expiringData.map((item, index) => (
                                    <li key={index} className="border-b pb-1">
                                        {item[0]} — expires on {item[1]}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Top Customers */}
                    <div className="bg-white p-4 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-3">
                            Top Customers
                        </h2>

                        {topCustomers.length === 0 ? (
                            <p className="text-gray-500">No data available</p>
                        ) : (
                            <ul className="space-y-2">
                                {topCustomers.map((customer, index) => (
                                    <li key={index} className="border-b pb-1">
                                        {customer.customer_name} — {customer.total_visits} visits
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}