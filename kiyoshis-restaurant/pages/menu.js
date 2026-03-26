import Head from "next/head";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const categories = ["All", "Sushi", "Platters", "Drinks", "Desserts"];

const menuData = {
  All: {
    heading: "Menu Overview",
    description:
      "Browse the full collection of sushi, platters, drinks, and desserts. Use the category bar to focus the list while keeping the same structured page layout.",
    items: [
      { name: "Salmon Nigiri Set", description: "Fresh salmon over seasoned rice with a clean soy-brushed finish.", price: "$18" },
      { name: "Kiyoshi Deluxe Platter", description: "A mixed platter for sharing with nigiri, rolls, and sashimi highlights.", price: "$44" },
      { name: "Yuzu Sparkling Soda", description: "Bright citrus and a light mineral finish for a crisp pairing.", price: "$6" },
      { name: "Matcha Cheesecake", description: "Creamy cheesecake with a gentle matcha note and clean finish.", price: "$9" },
      { name: "Spicy Tuna Roll", description: "Tuna, house seasoning, cucumber, and a sharper red accent of heat.", price: "$15" },
      { name: "Lunch Bento Platter", description: "A practical midday option with variety and balanced portions.", price: "$22" },
    ],
    highlights: ["Good starting point for first-time guests", "Balanced spread of signature items", "Best category if you want a fast overview"],
  },
  Sushi: {
    heading: "Sushi",
    description:
      "A tighter list of sushi staples and house favourites, built around clean presentation and dependable combinations.",
    items: [
      { name: "Salmon Nigiri Set", description: "Fresh salmon over seasoned rice with a soy-brushed finish.", price: "$18" },
      { name: "Bluefin Trio", description: "Three cuts of tuna selected for contrast in texture and richness.", price: "$24" },
      { name: "Spicy Tuna Roll", description: "Tuna, cucumber, house seasoning, and a restrained chili finish.", price: "$15" },
      { name: "Dragon Roll", description: "Prawn tempura, avocado, and eel sauce layered for a richer bite.", price: "$17" },
      { name: "Vegetable Maki", description: "Cucumber, avocado, pickled radish, and sesame for a lighter option.", price: "$12" },
      { name: "Chef Selection Sashimi", description: "A rotating selection prepared for guests who want a cleaner, fish-forward option.", price: "$28" },
    ],
    highlights: ["Best for guests focused on classic sushi", "Mix of lighter and richer options", "Suitable for lunch or dinner orders"],
  },
  Platters: {
    heading: "Platters",
    description:
      "Built for sharing, these combinations are designed to cover a wider range of tastes without making the order process complicated.",
    items: [
      { name: "Kiyoshi Deluxe Platter", description: "Mixed nigiri, sashimi, and signature rolls for two to three guests.", price: "$44" },
      { name: "Family Sushi Board", description: "A larger spread arranged for the table with flexible flavour balance.", price: "$72" },
      { name: "Lunch Bento Platter", description: "A compact weekday option with a more practical midday portion.", price: "$22" },
      { name: "Vegetarian Share Plate", description: "A mixed platter with rolls, sides, and lighter vegetarian combinations.", price: "$31" },
      { name: "Office Meeting Set", description: "Prepared for easy group sharing during workday pickup orders.", price: "$58" },
      { name: "Celebration Board", description: "A more premium arrangement for events, occasions, or larger reservations.", price: "$88" },
    ],
    highlights: ["Designed for shared dining", "Useful for office lunches and group dinners", "Best ordered ahead during busier periods"],
  },
  Drinks: {
    heading: "Drinks",
    description:
      "A compact drinks section focused on clean pairings rather than an oversized beverage list.",
    items: [
      { name: "Yuzu Sparkling Soda", description: "Citrus-led sparkling drink with a crisp finish.", price: "$6" },
      { name: "Cold Green Tea", description: "Light, refreshing, and suited to most sushi combinations.", price: "$5" },
      { name: "House Iced Matcha", description: "Smoother and more rounded with a slightly creamy texture.", price: "$7" },
      { name: "Japanese Cola", description: "A familiar option with a sharper finish and smaller serving profile.", price: "$5" },
      { name: "Still Water", description: "A simple table option for guests keeping the meal minimal.", price: "$3" },
      { name: "Sparkling Water", description: "Mineral-forward and suited to richer rolls and platters.", price: "$4" },
    ],
    highlights: ["Shorter list by design", "Pairing-friendly options", "Suitable for dine-in and takeaway"],
  },
  Desserts: {
    heading: "Desserts",
    description:
      "A short dessert finish with lighter options and a couple of richer close-out choices.",
    items: [
      { name: "Matcha Cheesecake", description: "Creamy cheesecake with a restrained matcha finish.", price: "$9" },
      { name: "Mochi Trio", description: "Three rotating mochi flavours presented as a lighter dessert option.", price: "$8" },
      { name: "Black Sesame Tart", description: "Nutty depth with a more structured, less sweet finish.", price: "$10" },
      { name: "Yuzu Sorbet", description: "A bright and colder finish for heavier meals.", price: "$7" },
      { name: "Caramel Miso Panna Cotta", description: "A softer dessert with a subtle savoury edge.", price: "$9" },
      { name: "Strawberry Short Slice", description: "A familiar dessert profile with a cleaner presentation.", price: "$8" },
    ],
    highlights: ["Designed as a simple final course", "Mix of lighter and richer finishes", "Good pairing with tea or sparkling drinks"],
  },
};

function MenuItemCard({ item }) {
  const { addToCart, items } = useCart();
  const inCart = items.find((i) => i.name === item.name);

  return (
    <article className="border border-[#cad5e1] bg-white/90 p-5 shadow-[0_18px_40px_rgba(17,39,63,0.08)]" aria-label={`${item.name} - ${item.price}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold tracking-tight text-[#15304f]">{item.name}</h3>
          <p className="mt-2 text-sm leading-7 text-stone-700">{item.description}</p>
        </div>
        <span className="shrink-0 rounded-full border border-[#b21f2d]/20 bg-[#fbeff1] px-3 py-1 text-sm font-semibold text-[#b21f2d]">
          {item.price}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => addToCart(item)}
          className="flex items-center gap-2 rounded-full border border-[#152d4b] px-4 py-1.5 text-sm font-semibold text-[#152d4b] transition-colors hover:bg-[#152d4b] hover:text-white"
          aria-label={`Add ${item.name} to cart`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add to Cart
        </button>
        {inCart && (
          <span className="text-xs text-neutral-500">{inCart.qty} in cart</span>
        )}
      </div>
    </article>
  );
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const baseCategories = categories.filter((category) => category !== "All");
  const allMenuItems = baseCategories.flatMap((category) => menuData[category].items);
  const filteredMenuItems = activeCategory === "All" ? allMenuItems : menuData[activeCategory].items;

  return (
    <div className="min-h-dvh flex flex-col bg-[#edf1f7] text-stone-950">
      <Head>
        <title>Menu | Sushi Bai Kiyoshi</title>
        <meta
          name="description"
          content="Explore the Sushi Bai Kiyoshi menu, including sushi, platters, drinks, and desserts in a cleaner blue-toned layout."
        />
      </Head>

      <Header active="menu" />

      <main className="relative flex-1 overflow-hidden bg-[#edf3f8]" aria-label="Menu page">
        <section className="relative border-b border-[#c4d1df] bg-white/80">
          <div className="mx-auto max-w-[92rem] px-4 py-8 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-semibold tracking-tight text-[#12263f] sm:text-5xl lg:text-6xl">Menu</h1>
          </div>
        </section>

        <section className="relative border-b border-[#ccd7e3] bg-white/90">
          <div className="mx-auto flex max-w-[92rem] flex-wrap justify-center gap-x-4 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
            {categories.map((cat) => (
              <button
                key={cat}
                className={
                  (activeCategory === cat
                    ? "border-[#b21f2d] bg-[#fbeff1] text-[#b21f2d]"
                    : "border-[#c9d4e2] bg-white text-[#35516e] hover:border-[#5d7794] hover:text-[#15304f]") +
                  " rounded-full border px-5 py-2 text-base font-semibold transition-colors duration-150 focus:outline-none"
                }
                onClick={() => setActiveCategory(cat)}
                type="button"
                aria-pressed={activeCategory === cat}
                aria-label={`Filter menu by ${cat}`}
                title={`Show ${cat} items`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-[92rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredMenuItems.map((item, index) => (
              <MenuItemCard key={`${activeCategory}-${item.name}-${index}`} item={item} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}