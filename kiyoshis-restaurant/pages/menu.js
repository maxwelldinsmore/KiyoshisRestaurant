import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

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

const placeholderImage = "/Website/11.jpg";

/*
  Optional frontend-only spice mapping.
  This is NOT from DB.
  You can add/remove items here anytime.
*/
const spiceLevels = {
  "Spicy Tuna Roll": 2,
  "Dragon Roll": 1,
};

function formatPrice(price) {
  const numeric = Number(price);
  if (Number.isNaN(numeric)) return "$0";
  return `$${numeric.toFixed(2).replace(/\.00$/, "")}`;
}

function getItemImage(itemName) {
  return localMenuImages[itemName] || placeholderImage;
}

function getItemSpiceLevel(itemName) {
  return spiceLevels[itemName] || 0;
}

function SpiceLevel({ level }) {
  if (!level) return null;

  return (
    <div
      className="mt-3 flex items-center gap-2"
      aria-label={`Spice level: ${level} ${level === 1 ? "chilli" : "chillies"}`}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-[#7d1020]">
        Spice:
      </span>
      <span className="text-base leading-none" aria-hidden="true">
        {"🌶️".repeat(level)}
      </span>
    </div>
  );
}

function MenuItemCard({ item }) {
  const { addToCart, items } = useCart();
  const inCart = items.find(
    (i) =>
      i.menu_item_id === item.menu_item_id ||
      i.name === item.menu_item_name
  );

  const imageSrc = item.menu_item_asset_path || getItemImage(item.menu_item_name);
  const spiceLevel = getItemSpiceLevel(item.menu_item_name);

  return (
    <article
      className="overflow-hidden rounded-xl border border-[#cad5e1] bg-white/95 shadow-[0_18px_40px_rgba(17,39,63,0.08)]"
      aria-label={`${item.menu_item_name} - ${formatPrice(item.menu_item_price)}`}
    >
      <div className="aspect-square w-full border-b border-[#d9e2ec] bg-[#eef3f8]">
        <img
          src={imageSrc}
          alt={item.menu_item_name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = placeholderImage;
          }}
        />
      </div>

      <div className="flex min-h-[220px] flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold tracking-tight text-[#15304f]">
              {item.menu_item_name}
            </h3>

            <p className="mt-2 text-sm leading-7 text-stone-700">
              {item.menu_item_description}
            </p>

            <SpiceLevel level={spiceLevel} />

            {!item.is_item_available && (
              <div className="mt-3 inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                Currently unavailable
              </div>
            )}

            {Number(item.menu_item_discount_percent) > 0 && (
              <div className="mt-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {Number(item.menu_item_discount_percent)}% off
              </div>
            )}
          </div>

          <span className="menu-price-pill shrink-0 rounded-full border border-[#7d1020]/30 bg-[#f3dde3] px-3 py-1 text-sm font-semibold text-[#7d1020]">
            {formatPrice(item.menu_item_price)}
          </span>
        </div>

        <div className="mt-auto pt-5 flex items-center justify-between">
          <button
            onClick={() =>
              addToCart({
                ...item,
                name: item.menu_item_name,
                price: formatPrice(item.menu_item_price),
                image: imageSrc,
              })
            }
            disabled={!item.is_item_available}
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              item.is_item_available
                ? "border-[#152d4b] text-[#152d4b] hover:bg-[#152d4b] hover:text-white"
                : "cursor-not-allowed border-gray-300 text-gray-400"
            }`}
            aria-label={`Add ${item.menu_item_name} to cart`}
            title={`Add ${item.menu_item_name} to Cart`}
            data-add-to-cart="true"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add to Cart
          </button>

          {inCart && (
            <span className="text-xs text-neutral-500">
              {inCart.qty} in cart
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchMenuItems() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/menu-items");
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.error || "Failed to load menu items.");
        }

        if (isMounted) {
          const availableData = Array.isArray(result.data) ? result.data : [];
          setMenuItems(availableData);
        }
      } catch (err) {
        console.error("Menu fetch error:", err);
        if (isMounted) {
          setError("Could not load menu items right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMenuItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const dbCategories = [...new Set(
      menuItems
        .map((item) => item.category_definition)
        .filter(Boolean)
    )];

    return ["All", ...dbCategories];
  }, [menuItems]);

  const filteredMenuItems = useMemo(() => {
    if (activeCategory === "All") return menuItems;
    return menuItems.filter(
      (item) => item.category_definition === activeCategory
    );
  }, [activeCategory, menuItems]);

  return (
    <div className="min-h-dvh flex flex-col bg-[#edf1f7] text-stone-950">
      <Head>
        <title>Menu | Sushi Bai Kiyoshi</title>
        <meta
          name="description"
          content="Explore the Sushi Bai Kiyoshi menu by category."
        />
      </Head>

      <Header active="menu" />

      <main className="relative flex-1 overflow-hidden bg-[#edf3f8]" aria-label="Menu page">
        <section className="relative border-b border-[#c4d1df] bg-white/80">
          <div className="mx-auto max-w-[92rem] px-4 py-8 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-semibold tracking-tight text-[#12263f] sm:text-5xl lg:text-6xl">
              Menu
            </h1>
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
          {loading ? (
            <div className="py-16 text-center text-base font-medium text-[#35516e]">
              Loading menu...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-center text-sm font-medium text-red-700">
              {error}
            </div>
          ) : filteredMenuItems.length === 0 ? (
            <div className="rounded-lg border border-[#cad5e1] bg-white px-4 py-8 text-center text-sm text-stone-600">
              No menu items found for this category.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredMenuItems.map((item) => (
                <MenuItemCard
                  key={item.menu_item_id}
                  item={item}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}