import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import MenuHighlightCard from "@/components/layout/menuCards";
import {
  fanFavorites,
  homeQuickActions,
  restaurantContactDetails,
  restaurantHours,
  todaysSpecials,
} from "@/data/homePageContent";

function LoopingMenuRow({ title, items = [], rowKey }) {
  const [startIndex, setStartIndex] = useState(0);

  if (!items.length) {
    return null;
  }

  const visibleCount = Math.min(3, items.length);
  const visibleItems = Array.from({ length: visibleCount }, (_, offset) => items[(startIndex + offset) % items.length]);
  const canRotate = items.length > 1;

  const showPrevious = () => {
    if (!canRotate) {
      return;
    }
    setStartIndex((current) => (current - 1 + items.length) % items.length);
  };

  const showNext = () => {
    if (!canRotate) {
      return;
    }
    setStartIndex((current) => (current + 1) % items.length);
  };

  return (
    <div className="mt-8 first:mt-0">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-white sm:text-2xl">{title}</h3>
      </div>

      <div className="mt-4 grid gap-5 md:grid-cols-3">
        {visibleItems.map((item, index) => (
          <MenuHighlightCard key={`${rowKey}-${item.name}-${startIndex}-${index}`} item={item} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={showPrevious}
          aria-label={`Show previous ${title.toLowerCase()}`}
          className="flex h-10 w-10 items-center justify-center border border-[#8da5bf] bg-[#17324f] text-lg text-white transition hover:bg-[#21486f] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={!canRotate}
        >
          {"<"}
        </button>
        <button
          type="button"
          onClick={showNext}
          aria-label={`Show next ${title.toLowerCase()}`}
          className="flex h-10 w-10 items-center justify-center border border-[#8da5bf] bg-[#17324f] text-lg text-white transition hover:bg-[#21486f] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={!canRotate}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

function QuickActionIcon({ title }) {
  if (title === "Order Pickup") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M5 7h14l-1.2 10.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
    );
  }

  if (title === "Contact Us") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3.8" y="5.8" width="16.4" height="12.4" rx="2" />
        <path d="m5.5 7.4 6.5 5.2 6.5-5.2" />
      </svg>
    );
  }

  if (title === "Find Us") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21l-6.8-3.6V7.6L12 4l6.8 3.6v9.8L12 21Z" />
      <path d="M8.8 11.8 11 14l4.2-4.2" />
    </svg>
  );
}

export default function Home() {
  const addressDetail = restaurantContactDetails.find((item) => item.label === "Address");
  const sidebarContactDetails = restaurantContactDetails.filter((item) => item.label !== "Address");

  return (
    <div className="min-h-dvh flex flex-col bg-[#edf3f8] text-[#102841]">
      <Head>
        <title>Sushi Bai Kiyoshi</title>
        <meta
          name="description"
          content="Order sushi pickup from Sushi Bai Kiyoshi in downtown Toronto. View menu highlights, opening hours, and contact details in one place."
        />
      </Head>

      <Header />

      <main className="flex-1">
        <section className="border-b border-[#c7d3e0] bg-[#edf3f8]">
          <div className="mx-auto max-w-[92rem] px-6 py-8 lg:px-8 lg:py-10">
            <div className="relative min-h-[360px] overflow-hidden border border-[#c7d3e0] bg-white shadow-[0_30px_60px_rgba(18,38,63,0.14)] sm:min-h-[460px]">
              <Image
                src="/SushiBaiKiyoshiBanner4.png"
                alt="Sushi Bai Kiyoshi restaurant banner showing sushi and branding"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 p-6">
                <div className="relative h-full text-center">
                  <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2">
                    <h1 className="home-banner-text text-5xl font-semibold tracking-tight text-white [text-shadow:0_4px_16px_rgba(0,0,0,0.6)] sm:text-6xl lg:text-7xl">
                      Sushi Bai
                    </h1>
                    <p className="home-banner-text mt-3 text-6xl font-semibold tracking-tight text-white [text-shadow:0_4px_16px_rgba(0,0,0,0.6)] sm:text-7xl lg:text-8xl">
                      Kiyoshi | 清
                    </p>
                  </div>

                  <p className="home-banner-text absolute bottom-8 left-1/2 w-full max-w-3xl -translate-x-1/2 px-4 text-base font-medium tracking-[0.08em] text-white/95 [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] sm:bottom-12 sm:text-lg">
                    Your Neighbourhood Sushi, Made with Heart.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#c7d3e0] bg-[#f5f9fd]">
          <div className="mx-auto grid max-w-[92rem] gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {homeQuickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                aria-label={action.title}
                title={action.title}
                className="group border border-[#c7d3e0] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_24px_rgba(18,38,63,0.12)]"
              >
                <div className="flex items-center justify-between">
                  <div className="home-quick-icon flex h-10 w-10 items-center justify-center rounded-full border border-[#cfdae7] bg-[#f3f7fb] text-[#102841]">
                    <QuickActionIcon title={action.title} />
                  </div>
                  <span className="text-sm text-[#6b8198] transition group-hover:text-[#102841]">&gt;</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-[#102841]">{action.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#4f657d]">{action.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-[#35516e] bg-[#102841]">
          <div className="mx-auto max-w-[92rem] px-6 py-12 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a8bfd6]">Menu Highlights</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Popular Picks Right Now</h2>
            </div>
            <Link href="/menu" className="border border-[#c7d3e0] bg-white px-5 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#102841] hover:bg-[#f5f9fd]">
              View Full Menu
            </Link>
          </div>

          <div className="mt-8 space-y-10">
            <LoopingMenuRow title="Today&apos;s Specials" items={todaysSpecials} rowKey="specials" />
            <LoopingMenuRow title="Fan Favourites" items={fanFavorites} rowKey="favorites" />
          </div>
          </div>
        </section>


        <section className="mx-auto max-w-[92rem] px-6 py-12 lg:px-8">
          <div className="relative overflow-hidden border border-[#c7d3e0] bg-white">
            <div className="absolute inset-0">
              <Image src="/Website/17.jpg" alt="Loyalty program promotion background" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-[#102841]/55" />
            </div>
            <div className="relative p-8 text-center sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d3dfeb]">Rewards Program</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Earn Points Every Time You Order</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#e2ebf4] sm:text-base">
                Sign up once, collect points with each eligible order, and unlock special rewards designed for returning customers.
              </p>
              <Link href="/register" className="mt-6 inline-block bg-[#b21f2d] px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#971926]">
                Join Loyalty
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[92rem] gap-8 px-6 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="border border-[#c7d3e0] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5a728c]">Visit Us</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#102841] sm:text-4xl">Find Our Downtown Location</h2>

            <div className="mt-6 border-t border-[#d8e2ec] pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5a728c]">Address</p>
              <p className="mt-1 text-base text-[#102841]">{addressDetail?.value}</p>
            </div>

            <div className="mt-6 overflow-hidden border border-[#c7d3e0] bg-white">
              <div className="relative h-[360px] w-full sm:h-[420px]">
                <Image src="/Website/map.png" alt="Map showing Sushi Bai Kiyoshi location in downtown Toronto" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </div>
          </div>

          <div className="border border-[#c7d3e0] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5a728c]">Contact And Hours</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#102841] sm:text-4xl">Everything You Need In One Place</h2>

            <div className="mt-6 border-t border-[#d8e2ec] pt-4">
              {sidebarContactDetails.map((item) => (
                <div key={item.label} className="border-b border-[#e2eaf2] py-3 last:border-b-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5a728c]">{item.label}</p>
                  <p className="mt-1 text-base text-[#102841]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[#d8e2ec] pt-4">
              <h3 className="text-lg font-semibold text-[#102841]">Restaurant Hours</h3>
              <div className="mt-2 space-y-2">
                {restaurantHours.map((entry) => (
                  <div key={entry.label} className="flex flex-col gap-1 border-b border-[#e2eaf2] py-2 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-medium text-[#4f657d]">{entry.label}</span>
                    <span className="text-sm font-semibold text-[#102841]">{entry.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-[#5a728c]">Same-day online orders close 30 minutes before closing.</p>
            </div>
          </div>
        </section>
      </main>
        <Footer />

      
    </div>
  );
}
