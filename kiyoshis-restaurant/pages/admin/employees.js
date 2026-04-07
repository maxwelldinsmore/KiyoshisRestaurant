import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

export default function EmployeesPage() {
    const router = useRouter();
    const { logout } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push("/admin/login");
    };
    const [formData, setFormData] = useState({
        employee_first_name: "",
        employee_last_name: "",
        employee_email: "",
        employee_phone_number: "",
        employee_password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchEmployees = async () => {
        try {
            const res = await fetch("/api/employees");
            const json = await res.json();

            if (json.success) {
                setEmployees(json.data);
            }
        } catch (err) {
            console.error("Error fetching employees:", err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const json = await res.json();

            if (json.success) {
                setSuccess("Employee created successfully!");
                setFormData({
                    employee_first_name: "",
                    employee_last_name: "",
                    employee_email: "",
                    employee_phone_number: "",
                    employee_password: ""
                });
                setShowForm(false);
                fetchEmployees();
            } else {
                setError(json.message || "Failed to create employee");
            }
        } catch (err) {
            setError("An error occurred while creating the employee");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (employeeId) => {
        if (!confirm("Are you sure you want to delete this employee?")) return;

        try {
            const res = await fetch(`/api/employees?id=${employeeId}`, {
                method: "DELETE"
            });

            const json = await res.json();

            if (json.success) {
                setSuccess("Employee deleted successfully!");
                fetchEmployees();
            } else {
                setError(json.message || "Failed to delete employee");
            }
        } catch (err) {
            setError("An error occurred while deleting the employee");
            console.error(err);
        }
    };

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 bg-[#edf1f7] p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">Employees</h1>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="bg-[#0a3e7a] text-white px-4 py-2 rounded-md hover:bg-[#082d5a]"
                                >
                                    {showForm ? "Cancel" : "Add Employee"}
                                </button>
                                <Link href="/admin/dashboard">
                                    <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                                        Back to Dashboard
                                    </button>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                            {success}
                        </div>
                    )}

                    {/* Form */}
                    {showForm && (
                        <div className="bg-white rounded-md shadow p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">Create New Employee</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="employee_first_name"
                                            value={formData.employee_first_name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a3e7a]"
                                            placeholder="John"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="employee_last_name"
                                            value={formData.employee_last_name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a3e7a]"
                                            placeholder="Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="employee_email"
                                            value={formData.employee_email}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a3e7a]"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="employee_phone_number"
                                            value={formData.employee_phone_number}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a3e7a]"
                                            placeholder="5551234567"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="employee_password"
                                            value={formData.employee_password}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0a3e7a]"
                                            placeholder="Password (leave empty for no password)"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-4 bg-[#0a3e7a] text-white px-6 py-2 rounded-md hover:bg-[#082d5a] disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Create Employee"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Employees Table */}
                    <div className="bg-white rounded-md shadow border overflow-x-auto">
                        {employees.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                No employees yet. Create your first employee!
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 text-sm">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">First Name</th>
                                        <th className="p-4">Last Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Phone</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {employees.map((employee) => (
                                        <tr key={employee.employee_id} className="border-t hover:bg-gray-50">
                                            <td className="p-4">{employee.employee_id}</td>
                                            <td className="p-4">{employee.employee_first_name}</td>
                                            <td className="p-4">{employee.employee_last_name}</td>
                                            <td className="p-4">{employee.employee_email || "—"}</td>
                                            <td className="p-4">{employee.employee_phone_number || "—"}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDelete(employee.employee_id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    </div>
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    );
}
