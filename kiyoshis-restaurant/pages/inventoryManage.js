import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function InventoryManage() {
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    // Fetch inventory
    const fetchInventory = async () => {
        try {
            const res = await fetch("/api/inventory");
            const json = await res.json();

            if (json.success) {
                setItems(json.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchInventory();
        fetchSuppliers();
    }, []);

    // Increase quantity
    const increaseQty = async (item) => {
        await fetch("/api/inventory", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inventory_item_id: item.inventory_item_id,
                quantity_available: (item.quantity_available || 0) + 1,
            }),
        });

        fetchInventory();
    };

    // Decrease quantity
    const decreaseQty = async (item) => {
        if ((item.quantity_available || 0) <= 0) return;

        await fetch("/api/inventory", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inventory_item_id: item.inventory_item_id,
                quantity_available: item.quantity_available - 1,
            }),
        });

        fetchInventory();
    };

    // fetches supplier info
    const fetchSuppliers = async () => {
        try {
            const res = await fetch("/api/suppliers");
            const json = await res.json();

            if (json.success) {
                setSuppliers(json.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getSupplierName = (id) => {
        const supplier = suppliers.find(s => s.supplier_id === id);
        return supplier ? supplier.supplier_name : "Unknown";
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-[#edf1f7] p-8">
                <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

                <div className="bg-white rounded-md shadow border overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-sm">
                        <tr>
                            <th className="p-4">Item</th>
                            <th className="p-4">Supplier</th>
                            <th className="p-4">Quantity</th>
                            <th className="p-4">Purchase Date</th>
                            <th className="p-4">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {items.map((item) => (
                            <tr key={item.inventory_item_id} className="border-t">
                                <td className="p-4">{item.inventory_item_id}</td>
                                <td className="p-4">{getSupplierName(item.supplier_id)}</td>
                                <td className="p-4">{item.quantity_available}</td>
                                <td className="p-4">{item.purchase_date}</td>

                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() => decreaseQty(item)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        −
                                    </button>

                                    <button
                                        onClick={() => increaseQty(item)}
                                        className="bg-green-600 text-white px-3 py-1 rounded"
                                    >
                                        +
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <Footer />
        </div>
    );
}