import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header({ active = "", userName = "", title = "" }) {
  const [searchQuery, setSearchQuery] = useState("");

  const getNavClass = (key) => {
    const isActive = active === key;
    return `text-sm font-medium transition-colors ${
      isActive
        ? "text-neutral-950 underline underline-offset-8 decoration-2"
        : "text-neutral-700 hover:text-neutral-950"
    }`;
  };

  return (
    <header className="border-b border-neutral-300 bg-white/95">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-5">
          <Image src="/KiyoshiLogo6.png" alt="Kiyoshi logo" width={145} height={54} className="object-contain" priority />
        </Link>

        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          <nav className="flex flex-wrap items-center gap-6 sm:gap-10 md:gap-14">
            <Link href="/find-us" className={getNavClass("find-us") + " text-base sm:text-lg"}>
              Find Us
            </Link>

            {userName ? (
              <Link href="/account" className={getNavClass("account") + " text-base sm:text-lg"}>
                Hello, {userName}
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className={getNavClass("sign-in") + " text-base sm:text-lg"}>
                  Sign In
                </Link>
              </>
            )}

            <Link
              href="/menu"
              className="rounded-full border border-[#152d4b] px-5 py-2 text-base sm:text-lg font-semibold text-[#152d4b] transition-colors hover:bg-[#152d4b] hover:text-white"
            >
              Order Now
            </Link>
          </nav>
        </div>
      </div>

      {title ? <h1 className="px-4 pb-3 text-2xl font-bold text-neutral-950 sm:px-6 lg:px-8">{title}</h1> : null}
    </header>
  );
}