import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function POSPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    phone: "",
    email: "",
    name: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [submitting, setSubmitting] = useState(false);

  // Fetch menu items on load
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/menu-items");
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to load menu items");
      }

      setMenuItems(Array.isArray(result.data) ? result.data : []);
      setError("");
    } catch (err) {
      console.error("Menu fetch error:", err);
      setError("Could not load menu items");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category_definition).filter(Boolean)),
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category_definition === selectedCategory;
    const matchesSearch =
      item.menu_item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.menu_item_description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.is_item_available;
  });

  const addToCart = (item) => {
    const existing = cart.find((i) => i.menu_item_id === item.menu_item_id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.menu_item_id === item.menu_item_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (menuItemId) => {
    setCart(cart.filter((i) => i.menu_item_id !== menuItemId));
  };

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
    } else {
      setCart(
        cart.map((i) =>
          i.menu_item_id === menuItemId ? { ...i, quantity } : i
        )
      );
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.menu_item_price || 0) * item.quantity,
    0
  );
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  const submitOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setSubmitting(true);

      // Create the order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_phone_num: customerInfo.phone || null,
          guest_email: customerInfo.email || null,
          order_total: total.toFixed(2),
          order_status: "pending",
          order_type: "in-store",
        }),
      });

      const orderResult = await orderRes.json();

      if (!orderRes.ok || !orderResult.success) {
        throw new Error(orderResult.error || "Failed to create order");
      }

      const orderId = orderResult.data.order_id;

      // Add items to order
      const itemsRes = await fetch("/api/pos/order-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          items: cart.map((item) => ({
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
          })),
          discount_percent: discountPercent,
          payment_method: paymentMethod,
        }),
      });

      const itemsResult = await itemsRes.json();

      if (!itemsRes.ok || !itemsResult.success) {
        throw new Error(itemsResult.error || "Failed to add items to order");
      }

      // Reset form
      alert(`Order #${orderId} created successfully!`);
      setCart([]);
      setCustomerInfo({ phone: "", email: "", name: "" });
      setDiscountPercent(0);
      setPaymentMethod("cash");
    } catch (err) {
      console.error("Order submission error:", err);
      alert("Error creating order: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f7fa]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading menu...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <Head>
        <title>POS - Kiyoshi's Restaurant</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#f5f7fa]">
        <Header />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-[#152d4b]">
                In-Store POS System
              </h1>
              <Link href="/admin/dashboard">
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                  Back to Dashboard
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Menu Section */}
              <div className="lg:col-span-2 space-y-4">
                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow p-4">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#152d4b] focus:border-transparent"
                  />

                  <div className="flex gap-2 mt-3 flex-wrap">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          selectedCategory === cat
                            ? "bg-[#152d4b] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu Items Grid */}
                {error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredItems.map((item) => (
                      <div
                        key={item.menu_item_id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
                      >
                        <h3 className="font-semibold text-lg text-[#152d4b] mb-2">
                          {item.menu_item_name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.menu_item_description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-[#b21f2d]">
                            ${parseFloat(item.menu_item_price).toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-[#152d4b] text-white px-4 py-2 rounded-lg hover:bg-[#0a2a4a] transition"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart and Order Section */}
              <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-6">
                <h2 className="text-2xl font-bold text-[#152d4b] mb-4">Cart</h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Cart is empty</p>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.menu_item_id}
                        className="flex justify-between items-center border-b pb-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm text-[#152d4b]">
                            {item.menu_item_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${parseFloat(item.menu_item_price).toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.menu_item_id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-12 px-2 py-1 border rounded text-center text-sm"
                          />
                          <button
                            onClick={() => removeFromCart(item.menu_item_id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-6 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({discountPercent}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-[#152d4b]">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Form */}
                <form onSubmit={submitOrder} className="space-y-4">
                  {/* Customer Info */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-[#152d4b] mb-3">
                      Customer Info
                    </p>
                    <input
                      type="text"
                      placeholder="Name (optional)"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  {/* Discount */}
                  <div className="border-t pt-4">
                    <label className="text-sm font-semibold text-[#152d4b]">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm mt-2"
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="border-t pt-4">
                    <label className="text-sm font-semibold text-[#152d4b]">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm mt-2"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="mobile">Mobile Payment</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="border-t pt-4 space-y-2">
                    <button
                      type="submit"
                      disabled={cart.length === 0 || submitting}
                      className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                    >
                      {submitting ? "Processing..." : "Complete Order"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCart([])}
                      className="w-full bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Clear Cart
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
