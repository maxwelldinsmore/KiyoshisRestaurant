import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState([]);

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

    useEffect(() => {
        fetchSuppliers();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-[#edf1f7] p-8">
                <h1 className="text-3xl font-bold mb-6">Suppliers</h1>

                <div className="bg-white rounded-md shadow border overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-sm">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Notes</th>
                        </tr>
                        </thead>

                        <tbody>
                        {suppliers.map((s) => (
                            <tr key={s.supplier_id} className="border-t">
                                <td className="p-4">{s.supplier_id}</td>
                                <td className="p-4">{s.supplier_name}</td>
                                <td className="p-4">{s.supplier_email}</td>
                                <td className="p-4">{s.supplier_phonenumber}</td>
                                <td className="p-4">{s.supplier_notes}</td>
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