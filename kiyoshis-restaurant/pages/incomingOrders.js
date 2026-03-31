import {useEffect, useState} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function IncomingOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        const res = await fetch("/api/orders?order_status=pending");
        const json = await res.json();
        setOrders(json.data || []);
    };

    const updateStatus = async (orderId, status) => {
        await fetch("/api/orders", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                order_id: orderId,
                order_status: status,
            }),
        });

        fetchOrders();
    };

    const getStatusStyles = (status) => {
        if (status === "pending")
            return "bg-yellow-100 text-yellow-700";
        if (status === "preparing")
            return "bg-blue-100 text-blue-700";
        if (status === "ready")
            return "bg-green-100 text-green-700";
        return "bg-gray-100 text-gray-700";
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <div className="p-6">
                <h1 className="text-2xl mb-5">Incoming Orders</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                        <div
                            key={order.order_id}
                            className="bg-white border border-[#d8e2ec] rounded-xl p-4 shadow-sm hover:shadow-md transition"
                        >
                            <h3 className="text-lg mb-2">Order #{order.order_id}</h3>

                            <p className="text-sm text-[#35516e]">
                                <strong>Customer:</strong>{" "}
                                {order.customer_first_name
                                    ? `${order.customer_first_name} ${order.customer_last_name}`
                                    : "Guest"}
                            </p>

                            <p className="text-sm text-[#35516e]">
                                <strong>Phone:</strong>{" "}
                                {order.guest_phone_num || "N/A"}
                            </p>

                            <p className="text-sm text-[#35516e]">
                                <strong>Pickup:</strong>{" "}
                                {new Date(order.pick_up_time).toLocaleString()}
                            </p>

                            <p className="text-sm text-[#35516e]">
                                <strong>Total:</strong> ${order.order_total}
                            </p>

                            <span
                                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(
                                    order.order_status
                                )}`}
                            >
                              {order.order_status}
                            </span>

                            <div className="flex gap-2 mt-3">
                                <button
                                    className="bg-[#0a3e7a] text-white px-3 py-1 rounded-md text-xs hover:brightness-110"
                                >
                                    Preparing
                                </button>

                                <button
                                    className="bg-[#a13737] text-white px-3 py-1 rounded-md text-xs hover:brightness-110"
                                >
                                    Ready
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
}