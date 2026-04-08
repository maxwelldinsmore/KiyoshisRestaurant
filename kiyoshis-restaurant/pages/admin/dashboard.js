import { useRouter } from "next/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/admin/login");
    };

    const dashboardLinks = [
        {
            title: "In-Store POS",
            description: "Process in-store orders and manage sales",
            href: "/admin/pos"
        },
        {
            title: "Incoming Orders",
            description: "Manage and track incoming customer orders",
            href: "/incomingOrders"
        },
        {
            title: "Inventory Management",
            description: "Manage stock levels and adjust quantities",
            href: "/inventoryManage"
        },
        {
            title: "Suppliers",
            description: "View and manage supplier information",
            href: "/inventorySuppliers"
        },
        {
            title: "Reports",
            description: "View sales, inventory, and customer analytics",
            href: "/reports"
        },
        {
            title: "Employees",
            description: "Create and manage employee records",
            href: "/admin/employees"
        }
    ];

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen flex flex-col bg-[#edf3f8] text-[#102841]">
                <Header />

                <main className="flex-1 px-6 py-12 lg:px-8">
                    <div className="mx-auto max-w-[92rem]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                                <p className="text-[#4f657d]">Manage your restaurant operations</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-[#b21f2d] text-white px-6 py-2 rounded-md hover:bg-[#971926] font-semibold"
                            >
                                Logout
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dashboardLinks.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    <div className="group border border-[#c7d3e0] bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_16px_24px_rgba(18,38,63,0.12)] cursor-pointer h-full">
                                        <h2 className="text-lg font-semibold text-[#102841] group-hover:text-[#0a3e7a]">{link.title}</h2>
                                        <p className="mt-2 text-sm leading-6 text-[#4f657d]">{link.description}</p>
                                        <div className="mt-4 text-sm font-semibold text-[#0a3e7a] flex items-center gap-2">
                                            Visit →
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
}
