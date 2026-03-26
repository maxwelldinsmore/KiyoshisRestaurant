import {LineChart, PieChart, BarChart} from 'react-chartkick'
import 'chartkick/chart.js'
import {useEffect, useState} from 'react'

export default function Reports() {
    const [salesData, setSalesData] = useState({})
    const [bestItem, setBestItem] = useState({})
    const [inventoryData, setInventoryData] = useState({})

    useEffect(() => {

        const fetchReports = async () => {
            try {

                // Sales in a Line Chart
                const salesRes = await fetch('/api/orders?report=sales_by_day')
                const salesJson = await salesRes.json()

                const salesFormatted = {}
                salesJson.data.forEach(row => {
                    salesFormatted[row.order_date] = Number(row.total_sales)
                })
                setSalesData(salesFormatted)

                const bestRes = await fetch('/api/orders?report=best_selling')
                const bestJson = await bestRes.json()

                const bestFormatted = bestJson.data.map(item => [
                    item.menu_item_name,
                    Number(item.total_sold)
                ])
                setBestItem(bestFormatted)

                const inventoryRes = await fetch('/api/inventory?report=low_stock')
                const inventoryJson = await inventoryRes.json()

                const inventoryFormatted = inventoryJson.data.map(item => [
                    `Item ${item.inventory_item_id}`,
                    Number(item.quantity_available)
                ])
                setInventoryData(inventoryFormatted)

            } catch (error) {
                console.error('Error loading reports:', error)
            }
        }
        fetchReports()
    }, [])

    return (
        <div style={{padding: '20px'}}>
            <h2>Sales Over Time</h2>
            <LineChart
                data={salesData}
                aria-label="Sales revenue over time"
                xtitle="Date"
                ytitle="Revenue"
                prefix="$"
                curve={false}
                download={true}
            />

            <h2>Best Selling Items</h2>
            <PieChart
                data={bestItem}
                donut={true}
                aria-label="Best selling menu items"
            />

            <h2>Low Inventory</h2>
            <BarChart
                data={inventoryData}
                aria-label="Low inventory items"
            />
        </div>
    )
}   