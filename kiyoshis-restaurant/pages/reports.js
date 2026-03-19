import { LineChart, PieChart, ColumnChart, BarChart } from 'react-chartkick'
import 'chart.js'
import { useEffect, useState } from 'react'

export default function Reports() {
    const [salesData, setSalesData] = useState({})
    const [bestItem, setBestItem] = useState({})
    const [inventoryData, setInventoryData] = useState({})

    useEffect(() => {
        // What food expire
        // Best selling item
        // Items running out daily
        // Sales trends over time
        // Customer preferences
        }, [])
}   