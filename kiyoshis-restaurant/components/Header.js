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
      <div className="flex items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/KiyoshiLogo6.png" alt="Kiyoshi logo" width={130} height={64} className="object-contain" priority />
        </Link>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <nav className="flex flex-wrap items-center gap-4 sm:gap-7 md:gap-10">
            <Link href="/find-us" className={getNavClass("find-us")}>
              Find Us
            </Link>

            {userName ? (
              <Link href="/account" className={getNavClass("account")}>
                Hello, {userName}
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className={getNavClass("sign-in")}>
                  Sign In
                </Link>
              </>
            )}

            <Link
              href="/menu"
              className="rounded-full border border-neutral-950 px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white"
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