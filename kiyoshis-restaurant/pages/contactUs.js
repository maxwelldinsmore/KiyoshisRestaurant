import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function ContactUsPage() {
  return (
    <div className={`${inter.className} min-h-dvh flex flex-col`}>
      <Head>
        <title>Contact Us | Sushi Bai Kiyoshi</title>
      </Head>

      <Header active="find-us" title="Contact Us" />

      <main className="flex-1 bg-[#f6f6f1]" aria-label="Contact Us page">
        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Contact Us</h1>
          <p className="mt-4 text-base text-stone-600">This is a basic Contact Us page. Content coming soon.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
