import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

const menuItems = [
  "Lorem ipsum dolor sit",
  "Aenean consectetur odio in condimentum tristique.",
  "Nam hendrerit urnaex.",
];

function MenuList() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="space-y-2">
          <p className="text-xl font-semibold leading-tight">♡ Lorem ipsum dolor sit</p>
          <p className="text-gray-500 leading-7 text-sm">{menuItems[1]} {menuItems[2]}</p>
        </div>
      ))}
    </div>
  );
}

function ImagePlaceholder({ className = "" }) {
  return (
    <div className={`bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 ${className}`}>
      Food Image
    </div>
  );
}

export default function MenuPage() {
  return (
    <div className={inter.className}>
      <Head>
        <title>Menu | Sushi Bai Kiyoshi</title>
      </Head>

      <Header active="menu" />

      <main className="bg-[#f6f6f1] min-h-screen">
        <section className="border-b border-gray-300 bg-gray-200/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-x-8 gap-y-3 text-2xl md:text-3xl font-semibold">
            <span className="border-b-2 border-black pb-1">All</span>
            <span className="text-gray-500">Sushi</span>
            <span className="text-gray-500">Platters</span>
            <span className="text-gray-500">Drinks</span>
            <span className="text-gray-500">Desserts</span>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-10">Appetizers</h1>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_260px] gap-8">
            <MenuList />
            <div className="space-y-6">
              <ImagePlaceholder className="h-64 rounded-md" />
              <MenuList />
            </div>
            <MenuList />
            <div className="space-y-3">
              <ImagePlaceholder className="h-44 rounded-md" />
              <ImagePlaceholder className="h-44 rounded-md" />
              <ImagePlaceholder className="h-44 rounded-md" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}