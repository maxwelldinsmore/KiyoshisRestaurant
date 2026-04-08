import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

function toNumberPrice(value) {
  if (typeof value === "number") return value;
  const numeric = Number(String(value || "").replace("$", "").trim());
  return Number.isFinite(numeric) ? numeric : 0;
}

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickUpTime, setPickUpTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const preparedItems = items.map((item) => {
    const unitPrice = toNumberPrice(item.price);
    const qty = Number(item.qty || 0);
    return {
      name: item.name,
      menu_item_id: item.menu_item_id,
      qty,
      unitPrice,
      lineTotal: unitPrice * qty,
    };
  });

  const total = preparedItems.reduce((sum, item) => sum + item.lineTotal, 0);

  // Ensure all items have required data before allowing submission. At least 1 item must be present, and all items must have a menu_item_id and qty > 0.
  const canSubmit = preparedItems.length > 0 && preparedItems.every((i) => i.menu_item_id && i.qty > 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Cart items are missing required menu item data. Please re-add items from the menu.");
      return;
    }

    try {
      setSubmitting(true);

      const createOrderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_phone_num: phone || null,
          guest_email: email || null,
          order_total: total.toFixed(2),
          pick_up_time: pickUpTime || null,
          order_status: "Pending",
          order_type: "online",
        }),
      });

      const createOrderJson = await createOrderRes.json();
      if (!createOrderRes.ok || !createOrderJson.success) {
        throw new Error(createOrderJson.error || "Failed to create order.");
      }

      const orderId = createOrderJson.data?.order_id;

      const addItemsRes = await fetch("/api/pos/order-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          items: preparedItems.map((item) => ({
            menu_item_id: item.menu_item_id,
            quantity: item.qty,
          })),
        }),
      });

      const addItemsJson = await addItemsRes.json();
      if (!addItemsRes.ok || !addItemsJson.success) {
        throw new Error(addItemsJson.error || "Failed to attach order items.");
      }

      setConfirmation({
        orderId,
        submittedAt: new Date().toISOString(),
        email: email || "Not provided",
        phone: phone || "Not provided",
        pickUpTime: pickUpTime || "Not provided",
        status: "Pending",
        type: "online",
        items: preparedItems,
        total,
      });

      clearCart();
    } catch (err) {
      setError(err.message || "Checkout failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col bg-[#edf3f8]">
      <Head>
        <title>Checkout | Sushi Bai Kiyoshi</title>
      </Head>

      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#102841]">Checkout</h1>

          {confirmation ? (
            <div className="mt-6 rounded border border-emerald-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-emerald-700">Order Sent Successfully</h2>
              <p className="mt-1 text-sm text-[#4f6780]">
                Order Successfully Submitted!
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <p><strong>Order ID:</strong> #{confirmation.orderId}</p>
                <p><strong>Status:</strong> {confirmation.status}</p>
                <p><strong>Order Type:</strong> {confirmation.type}</p>
                <p><strong>Submitted:</strong> {new Date(confirmation.submittedAt).toLocaleString()}</p>
                <p><strong>Email:</strong> {confirmation.email}</p>
                <p><strong>Phone:</strong> {confirmation.phone}</p>
                <p><strong>Pickup Time:</strong> {confirmation.pickUpTime}</p>
                <p><strong>Total:</strong> ${confirmation.total.toFixed(2)}</p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-[#102841]">Items Submitted</h3>
                <ul className="mt-2 divide-y divide-[#e5edf5] border border-[#e5edf5]">
                  {confirmation.items.map((item) => (
                    <li key={item.name} className="flex items-center justify-between px-3 py-2 text-sm">
                      <span>{item.name} x {item.qty}</span>
                      <span>${item.lineTotal.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <Link
                  href="/menu"
                  className="inline-flex rounded bg-[#152d4b] px-4 py-2 font-semibold text-white hover:bg-[#0f243d]"
                >
                  Back to Menu
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 rounded border border-[#c7d3e0] bg-white p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#102841]">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full border border-[#c7d3e0] px-3 py-2 outline-none focus:border-[#102841]"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[#102841]">Phone</label>
                  <input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full border border-[#c7d3e0] px-3 py-2 outline-none focus:border-[#102841]"
                    placeholder="1234567890"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="pickup" className="block text-sm font-semibold text-[#102841]">Pickup Time</label>
                  <input
                    id="pickup"
                    type="datetime-local"
                    value={pickUpTime}
                    onChange={(e) => setPickUpTime(e.target.value)}
                    className="mt-1 w-full border border-[#c7d3e0] px-3 py-2 outline-none focus:border-[#102841]"
                  />
                </div>
              </div>

              <div className="mt-6 rounded bg-[#f4f7fb] p-4">
                <p className="text-sm text-[#4f6780]">Order total</p>
                <p className="text-2xl font-bold text-[#102841]">${total.toFixed(2)}</p>
              </div>

              {error ? (
                <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={submitting || !canSubmit}
                className="mt-6 w-full rounded bg-[#152d4b] px-4 py-3 font-semibold text-white hover:bg-[#0f243d] disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Confirm and Send Order"}
              </button>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}