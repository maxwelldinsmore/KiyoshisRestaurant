import Link from "next/link";
import LogoPlaceholder from "./LogoPlaceholder";

function navClass(isActive) {
  return `text-sm font-medium transition-colors hover:text-black ${
    isActive ? "text-black underline underline-offset-8 decoration-2" : "text-black/65"
  }`;
}

export default function Header({ active = "", userName = "" }) {
  const accountHref = userName ? "/account" : "/register";
  const accountLabel = userName ? `Hello, ${userName}` : "Sign In";

  return (
    <nav className="border-b border-gray-200 bg-white/95 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <LogoPlaceholder />
          <Link href="/" className="font-semibold text-lg tracking-tight truncate">Sushi Bai Kiyoshi</Link>
        </div>
        <div className="flex items-center gap-4 sm:gap-7 md:gap-9">
          <Link href="/#find-us" className={navClass(active === "find-us")}>
            Find Us
          </Link>
          <Link href="/menu" className={navClass(active === "menu")}>
            Menu
          </Link>
          <Link href={accountHref} className={navClass(active === "account" || active === "register")}>
            {accountLabel}
          </Link>
          <Link
            href="/menu"
            className="border border-black px-4 sm:px-5 py-2 text-sm font-semibold rounded-full hover:bg-black hover:text-white transition-colors"
          >
            Order Now
          </Link>
        </div>
      </div>
    </nav>
  );
}