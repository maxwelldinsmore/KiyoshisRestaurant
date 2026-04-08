import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/contexts/CartContext";

const AUTH_CACHE_KEY = "kiyoshi.authUser";

export default function Header({ active = "", userName = "" }) {
  const router = useRouter();
  const [cachedUserName, setCachedUserName] = useState(userName || "");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const cartDropdownRef = useRef(null);
  const { items: cartItems, removeFromCart } = useCart();

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => {
    const price = parseFloat((i.price || "").replace("$", "")) || 0;
    return sum + price * i.qty;
  }, 0);

  // Auth fetch with sessionStorage cache
  useEffect(() => {
    let cancelled = false;
    const applyName = (value) => {
      if (!cancelled) setCachedUserName(value || "");
    };

    if (userName) {
      applyName(userName);
      return () => { cancelled = true; };
    }

    if (typeof window !== "undefined") {
      try {
        const cachedRaw = window.sessionStorage.getItem(AUTH_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (cached?.firstName) applyName(cached.firstName);
        }
      } catch {}
    }

    const controller = new AbortController();
    fetch("/api/auth/user", { credentials: "include", signal: controller.signal })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.user?.firstName) {
          applyName(data.user.firstName);
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(data.user));
          }
          return;
        }
        applyName("");
        if (typeof window !== "undefined") window.sessionStorage.removeItem(AUTH_CACHE_KEY);
      })
      .catch((err) => { if (err.name !== "AbortError") {} });

    return () => { cancelled = true; controller.abort(); };
  }, [userName]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(e.target)) {
        setCartDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const syncDarkMode = () => {
      setIsDarkMode(root.classList.contains("a11y-dark"));
    };

    syncDarkMode();

    const observer = new MutationObserver(syncDarkMode);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Global keyboard hotkeys — keydown listener works identically in all browsers
  useEffect(() => {
    const handleHotkey = (e) => {
      if (!e.altKey) return;
      switch (e.key.toLowerCase()) {
        case "f":
          e.preventDefault();
          router.push("/findUs");
          break;
        case "m":
          e.preventDefault();
          router.push("/menu");
          break;
        case "i":
          e.preventDefault();
          if (cachedUserName) {
            setUserDropdownOpen((o) => !o);
          } else {
            router.push("/signIn");
          }
          break;
        case "c":
          e.preventDefault();
          setCartDropdownOpen((o) => !o);
          break;
      }
    };
    document.addEventListener("keydown", handleHotkey);
    return () => document.removeEventListener("keydown", handleHotkey);
  }, [router, cachedUserName]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    if (typeof window !== "undefined") window.sessionStorage.removeItem(AUTH_CACHE_KEY);
    setCachedUserName("");
    setUserDropdownOpen(false);
    router.push("/");
  };

  const getNavClass = (key) => {
    const isActive = active === key;
    return `font-medium transition-colors ${
      isActive
        ? "text-neutral-950 underline underline-offset-8 decoration-2"
        : "text-neutral-700 hover:text-neutral-950"
    }`;
  };

  // Temporary state for SMS test
  const [smsStatus, setSmsStatus] = useState("");
  const sendTestSms = async () => {
    setSmsStatus("Sending...");
    try {
      const res = await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "+16479704076", 
          message: "Welcome to Sushi Bai Kiyoshi’s! Thank you for registering. Here youll receive updates and promotions!"
        })
      });
      const data = await res.json();
      if (res.ok) setSmsStatus("SMS sent!");
      else setSmsStatus(data.error || "Failed to send");
    } catch (e) {
      setSmsStatus("Error sending SMS");
    }
  };

  return (
    <header className="border-b border-neutral-300 bg-white/95" aria-label="Main header">
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-5" aria-label="Go to homepage" title="Home">
          <Image
            src={isDarkMode ? "/KiyoshiLogo7.png" : "/KiyoshiLogo6.png"}
            alt="Kiyoshi logo"
            width={145}
            height={54}
            style={{ width: "145px", height: "auto" }}
            className="object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
                    {/* TEMP: Send Promotion SMS button */}
                    <div>
                      <button
                        onClick={sendTestSms}
                        style={{ background: '#b21f2d', color: 'white', borderRadius: 4, padding: '6px 12px', marginRight: 8 }}
                      >
                        Send Promotion
                      </button>
                      {smsStatus && <span style={{ fontSize: 12, color: '#b21f2d' }}>{smsStatus}</span>}
                    </div>
          {/* Main nav links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 md:gap-12" aria-label="Main navigation">
            <Link href="/findUs" className={getNavClass("findUs") + " text-base sm:text-lg"} aria-label="Find restaurant location" title="Find Us (Alt+F)">
              Find Us
            </Link>

            <Link href="/menu" className={getNavClass("menu") + " text-base sm:text-lg"} aria-label="Browse our menu" title="Menu (Alt+M)">
              Menu
            </Link>

            {/* Auth: dropdown when signed in, link when signed out */}
            {cachedUserName ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen((o) => !o)}
                  className={getNavClass("account") + " text-base sm:text-lg flex items-center gap-1"}
                  aria-label="Account menu"
                  aria-expanded={userDropdownOpen}
                  title="Account menu (Alt+I)"
                >
                  Hello, {cachedUserName}
                  <svg
                    className={`w-4 h-4 transition-transform duration-150 ${userDropdownOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-neutral-200 shadow-lg rounded-sm z-50 py-1">
                    <Link
                      href="/account"
                      className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Manage Account
                    </Link>
                    <Link
                      href="/reports"
                      className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Kiyoshi Log
                    </Link>
                    <Link
                        href="/inventoryManage"
                        className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                        onClick={() => setUserDropdownOpen(false)}
                    >
                      Inventory Management
                    </Link>
                    <Link
                        href="/inventorySuppliers"
                        className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                        onClick={() => setUserDropdownOpen(false)}
                    >
                      Suppliers
                    </Link>
                    <Link
                        href="/incomingOrders"
                        className="block px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                        onClick={() => setUserDropdownOpen(false)}
                    >
                      Incoming Orders
                    </Link>
                    <div className="my-1 border-t border-neutral-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/signIn" className={getNavClass("signIn") + " text-base sm:text-lg"} aria-label="Go to sign in page" title="Sign In (Alt+I)">
                Sign In
              </Link>
            )}
          </nav>

          {/* Cart button */}
          <div className="relative" ref={cartDropdownRef}>
            <button
              onClick={() => setCartDropdownOpen((o) => !o)}
              className="relative flex items-center gap-2 rounded-full border border-[#152d4b] px-4 py-2 text-sm sm:text-base font-semibold text-[#152d4b] transition-colors hover:bg-[#152d4b] hover:text-white"
              aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
              title="Cart (Alt+C)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8M17 13l1.6 8M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#b21f2d] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {cartDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-neutral-200 shadow-xl rounded-sm z-50">
                <div className="border-b border-neutral-100 px-4 py-3">
                  <p className="text-sm font-semibold text-neutral-950">Your Cart</p>
                </div>

                {cartItems.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-neutral-500">Your cart is empty.</p>
                ) : (
                  <>
                    <ul className="max-h-64 divide-y divide-neutral-100 overflow-y-auto">
                      {cartItems.map((item) => (
                        <li key={item.name} className="flex items-center justify-between gap-3 px-4 py-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-neutral-900">{item.name}</p>
                            <p className="text-xs text-neutral-500">{item.price} × {item.qty}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.name)}
                            className="shrink-0 text-xs text-neutral-400 transition-colors hover:text-red-500"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-2 border-t border-neutral-100 px-4 py-3">
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <Link
                        href="/checkout"
                        onClick={() => setCartDropdownOpen(false)}
                        className="cart-checkout-btn block w-full rounded-sm bg-[#152d4b] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1a3a5e]"
                      >
                        Proceed to Checkout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
