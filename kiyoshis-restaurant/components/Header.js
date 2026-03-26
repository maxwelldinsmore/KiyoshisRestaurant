import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const AUTH_CACHE_KEY = "kiyoshi.authUser";

export default function Header({ active = "", userName = "" }) {
  const [cachedUserName, setCachedUserName] = useState(userName || "");

  useEffect(() => {
    let cancelled = false;

    const applyName = (value) => {
      if (!cancelled) setCachedUserName(value || "");
    };

    if (userName) {
      applyName(userName);
      return () => {
        cancelled = true;
      };
    }

    if (typeof window !== "undefined") {
      try {
        const cachedRaw = window.sessionStorage.getItem(AUTH_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (cached?.firstName) {
            applyName(cached.firstName);
          }
        }
      } catch {
        // Ignore malformed cache and continue with network request.
      }
    }

    const controller = new AbortController();

    fetch("/api/auth/user", {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));

        if (res.ok && data?.user?.firstName) {
          const firstName = data.user.firstName;
          applyName(firstName);

          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(data.user));
          }
          return;
        }

        applyName("");
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem(AUTH_CACHE_KEY);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [userName]);

  const getNavClass = (key) => {
    const isActive = active === key;
    return `text-sm font-medium transition-colors ${
      isActive
        ? "text-neutral-950 underline underline-offset-8 decoration-2"
        : "text-neutral-700 hover:text-neutral-950"
    }`;
  };

  return (
    <header className="border-b border-neutral-300 bg-white/95" aria-label="Main header">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-5" aria-label="Go to homepage" title="Home">
          <Image
            src="/KiyoshiLogo6.png"
            alt="Kiyoshi logo"
            width={145}
            height={54}
            style={{ width: "145px", height: "auto" }}
            className="object-contain"
            priority
          />
        </Link>

        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          <nav className="flex flex-wrap items-center gap-6 sm:gap-10 md:gap-14" aria-label="Main navigation">
            <Link href="/findUs" className={getNavClass("findUs") + " text-base sm:text-lg"} aria-label="Find restaurant location" title="Find Us">
              Find Us
            </Link>

            {cachedUserName ? (
              <Link href="/account" className={getNavClass("account") + " text-base sm:text-lg"} aria-label="Go to your account" title="Account">
                Hello, {cachedUserName}
              </Link>
            ) : (
              <Link href="/signIn" className={getNavClass("signIn") + " text-base sm:text-lg"} aria-label="Go to sign in page" title="Sign-In">
                Sign In
              </Link>
            )}

            <Link
              href="/menu"
              className="rounded-full border border-[#152d4b] px-5 py-2 text-base sm:text-lg font-semibold text-[#152d4b] transition-colors hover:bg-[#152d4b] hover:text-white" aria-label="Order food from menu" title="Order Now">
              Order Now
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
