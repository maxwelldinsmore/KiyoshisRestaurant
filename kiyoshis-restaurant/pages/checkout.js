import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const placeholderImage = "/Website/11.jpg";

// Imported images to use for the menu items. just a simple copy from the menu page.
const localMenuImages = {
  "Salmon Nigiri Set": "/images/menu/salmon-nigiri-set.jpg",
  "Bluefin Trio": "/images/menu/bluefin-trio.jpg",
  "Spicy Tuna Roll": "/images/menu/spicy-tuna-roll.jpg",
  "Dragon Roll": "/images/menu/dragon-roll.jpg",
  "Vegetable Maki": "/images/menu/vegetable-maki.jpg",
  "Chef Selection Sashimi": "/images/menu/chef-selection-sashimi.jpg",
  "Kiyoshi Deluxe Platter": "/images/menu/kiyoshi-deluxe-platter.jpg",
  "Family Sushi Board": "/images/menu/family-sushi-board.jpg",
  "Lunch Bento Platter": "/images/menu/lunch-bento-platter.jpg",
  "Vegetarian Share Plate": "/images/menu/vegetarian-share-plate.jpg",
  "Office Meeting Set": "/images/menu/office-meeting-set.jpg",
  "Celebration Board": "/images/menu/celebration-board.jpg",
  "Yuzu Sparkling Soda": "/images/menu/yuzu-sparkling-soda.jpg",
  "Cold Green Tea": "/images/menu/cold-green-tea.jpg",
  "House Iced Matcha": "/images/menu/house-iced-matcha.jpg",
  "Japanese Cola": "/images/menu/japanese-cola.jpg",
  "Still Water": "/images/menu/still-water.jpg",
  "Sparkling Water": "/images/menu/sparkling-water.jpg",
  "Matcha Cheesecake": "/images/menu/matcha-cheesecake.jpg",
  "Mochi Trio": "/images/menu/mochi-trio.jpg",
  "Black Sesame Tart": "/images/menu/black-sesame-tart.jpg",
  "Yuzu Sorbet": "/images/menu/yuzu-sorbet.jpg",
  "Caramel Miso Panna Cotta": "/images/menu/caramel-miso-panna-cotta.jpg",
  "Strawberry Short Slice": "/images/menu/strawberry-short-slice.jpg",
};

// Function to convert price strings like "$12.99" to numeric values. 
function toNumberPrice(value) {
  if (typeof value === "number") return value;
  const numeric = Number(String(value || "").replace("$", "").trim());
  return Number.isFinite(numeric) ? numeric : 0;
}

// Function to determine the image to use for a cart item, checking multiple potential sources before falling back to a placeholder. Used menu page as a reference and expanded to check for an image property directly on the cart item, then a menu_item_asset_path, then the localMenuImages mapping based on item name, before finally using the placeholder image. 
function getItemImage(item) {
  return item.image || item.menu_item_asset_path || localMenuImages[item.name] || placeholderImage;
}

function getItemBadges(item) {
  const badges = [];

  if (item.qty > 1) {
    badges.push(`${item.qty}x`);
  } else {
    badges.push("1x");
  }

  badges.push("Ready to send");

  if (item.unitPrice > 0) {
    badges.push(`$${item.unitPrice.toFixed(2)} each`);
  }

  return badges;
}

export default function CheckoutPage() {
  const { items, addToCart, removeFromCart, updateItemQty, clearCart } = useCart();
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
      image: getItemImage(item),
    };
  });

  const total = preparedItems.reduce((sum, item) => sum + item.lineTotal, 0);

  // Ensure all items have required data before allowing submission. At least 1 item must be present, and all items must have a menu_item_id and qty > 0.
  const canSubmit = preparedItems.length > 0 && preparedItems.every((i) => i.menu_item_id && i.qty > 0);

  const incrementItem = (item) => {
    addToCart(item);
  };

  const decrementItem = (item) => {
    const nextQty = Number(item.qty || 0) - 1;
    if (nextQty <= 0) {
      removeFromCart(item.name);
      return;
    }
    updateItemQty(item.name, nextQty);
  };

  const cancelItem = (item) => {
    removeFromCart(item.name);
  };

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
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4f6780]">
            Review your order!
          </p>

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
                <ul className="mt-3 space-y-3">
                  {confirmation.items.map((item) => (
                    <li key={item.name} className="flex gap-3 rounded border border-[#e5edf5] bg-white p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 shrink-0 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = placeholderImage;
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#102841]">{item.name}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {getItemBadges(item).map((badge) => (
                                <span
                                  key={badge}
                                  className="inline-flex rounded-full bg-[#edf3f8] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#4f6780]"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="shrink-0 text-sm font-semibold text-[#102841]">
                            ${item.lineTotal.toFixed(2)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#6a7f96]">
                          This item will be included in the order sent to the restaurant.
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <Link
                  href="/menu"
                  className="checkout-page-btn"
                >
                  Back to Menu
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 rounded border border-[#c7d3e0] bg-white p-6">
              {preparedItems.length === 0 && (
                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">Your cart is empty.</p>
                  <p className="mt-1 text-sm text-amber-700">
                    Add menu items first, then come back to checkout.
                  </p>
                  <Link
                    href="/menu"
                    className="checkout-page-btn mt-3 text-sm"
                  >
                    Go to Menu
                  </Link>
                </div>
              )}

              <div className="mb-6 rounded-lg border border-[#d8e3ee] bg-[#f8fbfe] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5f768d]">
                      Order Summary
                    </p>
                    <p className="mt-1 text-sm text-[#4f6780]">
                      Review your cart before checkout.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#152d4b] px-3 py-1 text-xs font-semibold text-white">
                    {preparedItems.length} item{preparedItems.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {preparedItems.map((item) => (
                    <div key={item.name} className="flex gap-3 rounded-lg bg-white p-3 shadow-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 shrink-0 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = placeholderImage;
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#102841]">{item.name}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {getItemBadges(item).map((badge) => (
                                <span
                                  key={badge}
                                  className="inline-flex rounded-full bg-[#edf3f8] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#4f6780]"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="shrink-0 text-sm font-semibold text-[#102841]">
                            ${item.lineTotal.toFixed(2)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#6a7f96]">
                          Added to the final order that will be processed by the restaurant.
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => decrementItem(item)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#c7d3e0] bg-white text-sm font-semibold text-[#102841] hover:bg-[#edf3f8]"
                            aria-label={`Decrease quantity of ${item.name}`}
                            disabled={submitting}
                          >
                            -
                          </button>
                          <span className="inline-flex min-w-10 items-center justify-center rounded bg-[#f4f7fb] px-2 py-1 text-xs font-semibold text-[#102841]">
                            Qty {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => incrementItem(item)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#c7d3e0] bg-white text-sm font-semibold text-[#102841] hover:bg-[#edf3f8]"
                            aria-label={`Increase quantity of ${item.name}`}
                            disabled={submitting}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => cancelItem(item)}
                            className="ml-auto inline-flex rounded border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                            aria-label={`Cancel ${item.name} from cart`}
                            disabled={submitting}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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