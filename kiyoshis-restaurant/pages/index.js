import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

const heroSlides = [
  {
    title: "Fresh sushi, simple atmosphere",
    text: "Add your hero image to public/hero.jpg and update this text with your real restaurant message.",
  },
  {
    title: "Made daily with clean ingredients",
    text: "Use this area for a short message about quality, freshness, and the restaurant experience.",
  },
  {
    title: "A calm place for great food",
    text: "Keep the message short here so the image stays as the focus under the main name section.",
  },
];

const specials = [
  {
    title: "Salmon Roll",
    text: "Fresh salmon, seasoned rice, and a simple soy glaze.",
  },
  {
    title: "Tuna Nigiri",
    text: "Hand-pressed rice topped with sliced tuna and light seasoning.",
  },
  {
    title: "Dragon Roll",
    text: "A bold roll with layered texture and a balanced finish.",
  },
  {
    title: "Miso Soup",
    text: "A warm starter with tofu, broth, and green onion.",
  },
];

const favourites = [
  {
    title: "California Roll",
    text: "A house favorite with a clean, familiar flavor.",
  },
  {
    title: "Shrimp Tempura",
    text: "Crisp texture with a light batter and dipping sauce.",
  },
  {
    title: "Sashimi Plate",
    text: "A simple plate focused on freshness and presentation.",
  },
  {
    title: "House Bento",
    text: "A complete meal with sushi, sides, and a warm main.",
  },
];

function MenuSection({ title, items }) {
  return (
    <section className="py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center tracking-tight">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-9">
          {items.map((item) => (
            <div key={item.title} className="border border-gray-200 rounded-md bg-white p-4 shadow-sm">
              <div className="h-40 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-sm text-gray-400">
                Image
              </div>
              <h3 className="text-base font-semibold mt-4">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-6 mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);
  const currentSlide = heroSlides[slideIndex];

  const goToPrevious = () => {
    setSlideIndex((slideIndex - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setSlideIndex((slideIndex + 1) % heroSlides.length);
  };

  return (
    <div className={inter.className}>
      <Head>
        <title>Sushi Bai Kiyoshi</title>
        <meta name="description" content="Sushi Bai Kiyoshi restaurant homepage" />
      </Head>

      <Header />

      <main className="space-y-2">
        <section className="pt-8 pb-6 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative h-[320px] sm:h-[360px] md:h-[430px] overflow-hidden rounded-md border border-gray-200 bg-gray-100 shadow-sm">
              <Image
                src="/sushiBaiKiyoshiLogo.png"
                alt="Sushi Bai Kiyoshi hero artwork"
                fill
                priority
                style={{ objectFit: "contain", objectPosition: "center" }}
              />
            </div>
          </div>
        </section>

        <section className="pb-14 md:pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative h-[460px] md:h-[520px] overflow-hidden rounded-md border border-gray-200 bg-gray-900 shadow-sm">
              <Image
                src="/hero.jpg"
                alt="Restaurant hero image"
                fill
                priority
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-10 text-white">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{currentSlide.title}</h2>
                <p className="text-base leading-7 mt-3 max-w-2xl text-gray-100">{currentSlide.text}</p>
              </div>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/85 text-black text-xl"
                aria-label="Previous slide"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/85 text-black text-xl"
                aria-label="Next slide"
              >
                ›
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setSlideIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full ${
                      index === slideIndex ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <MenuSection title="Today's Specials" items={specials} />
        <MenuSection title="Fan Favourites" items={favourites} />

        <section className="py-16 md:py-20 bg-black text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg font-semibold border border-white/30 px-8 py-4 inline-block leading-7">
              Become a part of our loyalty program and earn points.
            </p>
            <div className="mt-8 md:mt-10 h-64 md:h-72 bg-gray-800 rounded-md border border-white/10 flex items-center justify-center text-gray-400">
              Loyalty Image
            </div>
            <button className="mt-8 md:mt-10 bg-white text-black px-12 py-3 text-sm font-semibold rounded-sm hover:bg-gray-200 transition-colors">
              Sign Up
            </button>
          </div>
        </section>

        <section id="find-us" className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Sushi Bai Kiyoshi</h2>
              <p className="text-sm uppercase tracking-[0.18em] text-gray-500 mt-6">
                Monday - Friday: Time - Time
              </p>

              <h3 className="text-sm uppercase tracking-[0.18em] font-bold mt-12">Sign Up Today</h3>
              <p className="text-sm text-gray-500 mt-2 leading-6">
                Add your email signup text here.
              </p>
              <input
                type="text"
                placeholder="Enter your text here"
                className="w-full mt-4 border border-gray-300 px-4 py-3 text-sm rounded-sm outline-none focus:border-black"
              />
              <button className="w-full mt-4 bg-black text-white py-3 text-sm font-semibold rounded-sm hover:bg-gray-800 transition-colors">
                Click here!
              </button>
            </div>

            <div>
              <p className="text-center text-sm font-bold uppercase tracking-[0.18em] leading-7 mb-6">
                Agaj Street, 245 - SDJS City
                <br />
                Happy Place
              </p>
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-74.010%2C40.710%2C-73.990%2C40.720&layer=mapnik"
                title="Restaurant location"
                loading="lazy"
                className="w-full min-h-[320px] border border-gray-200 rounded-md"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
