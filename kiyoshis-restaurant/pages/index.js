import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

const specials = [
  { title: "Lorem ipsum dolor 1", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 1ss", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 1sad", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor asd1", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
];

const favourites = [
  { title: "Lorem ipsum dolor 1", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 1", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 1", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 1", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
];

const carouselSlides = [
  {
    title: "Lorem ipsum dolor sit amet",
    text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urna exon.",
  },
  {
    title: "Fresh ingredients. Bold flavor.",
    text: "Use this slide for your second hero message once images are added.",
  },
  {
    title: "Crafted daily in our kitchen",
    text: "Use this slide for promotions, daily specials, or chef highlights.",
  },
];

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);
  const currentSlide = carouselSlides[slideIndex];

  const previousSlide = () => {
    setSlideIndex((current) => (current === 0 ? carouselSlides.length - 1 : current - 1));
  };

  const nextSlide = () => {
    setSlideIndex((current) => (current === carouselSlides.length - 1 ? 0 : current + 1));
  };

  return (
    <div className={`${inter.className} min-h-dvh flex flex-col`}>
      <Head>
        <title>Sushi Bai Kiyoshi</title>
        <meta name="description" content="Sushi Bai Kiyoshi restaurant homepage" />
      </Head>

      <Header />

      <main className="flex-1 w-full bg-[#f3f3f1] text-stone-950">
        <section className="border-b border-stone-300 bg-[#f3f3f1]">
          <div className="mx-auto max-w-[1800px] px-3 py-8 sm:px-5 lg:px-8">
            <div className="relative h-[380px] overflow-hidden border border-stone-300 bg-white sm:h-[460px] md:h-[560px]">
              <Image
                src="/SushiBaiKiyoshiBanner1.png"
                alt="Sushi Bai Kiyoshi hero banner"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <p className="pt-6 pb-4 text-center text-sm uppercase tracking-[0.28em] text-stone-600">Where Freshness Meets Tradition.</p>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-[1800px] px-3 sm:px-5 lg:px-8">
            <div className="relative overflow-hidden border border-stone-300 bg-black text-white">
              <div className="flex h-[450px] items-center justify-center bg-stone-800 text-sm text-stone-300 md:h-[560px]">
                Add carousel hero image {slideIndex + 1} here
              </div>
              <div className="absolute inset-0 bg-black/35" />

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
                <h2 className="text-4xl font-bold tracking-tight">{currentSlide.title}</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-stone-100">
                  {currentSlide.text}
                </p>
              </div>

              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/40 text-2xl transition-colors hover:bg-black/65"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/40 text-2xl transition-colors hover:bg-black/65"
              >
                ›
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {carouselSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setSlideIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      index === slideIndex ? "bg-white" : "bg-white/45"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-[1800px] px-3 sm:px-5 lg:px-8">
            <h2 className="text-center text-5xl font-bold tracking-tight">Today's Specials</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {specials.map((item, index) => (
                <article key={`special-${index}`} className="rounded-2xl border border-stone-300 bg-white p-4">
                  <div className="flex h-32 items-center justify-center rounded-lg border border-stone-300 bg-stone-100 text-sm text-stone-400">
                    Add image
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-500">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-14">
          <div className="mx-auto max-w-[1800px] px-3 sm:px-5 lg:px-8">
            <h2 className="text-center text-5xl font-bold tracking-tight">Fan Favourites</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {favourites.map((item, index) => (
                <article key={`fav-${index}`} className="rounded-2xl border border-stone-300 bg-white p-4">
                  <div className="flex h-32 items-center justify-center rounded-lg border border-stone-300 bg-stone-100 text-sm text-stone-400">
                    Add image
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-500">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-16 pb-20">
          <div className="mx-auto max-w-[1800px] px-3 sm:px-5 lg:px-8">
            <div className="border border-stone-300 bg-white p-6 text-center">
              <p className="text-2xl font-semibold tracking-tight md:text-3xl">Become Apart of our loyalty program and earn points!</p>
            </div>
            <div className="mt-6 border border-stone-300 bg-stone-900 p-6">
              <div className="flex h-64 items-center justify-center bg-stone-700 text-sm text-stone-300 md:h-72">
                Add loyalty image here
              </div>
              <div className="mt-6 text-center">
                <button className="bg-white px-10 py-3 text-base font-semibold text-stone-950">Sign Up</button>
              </div>
            </div>
          </div>
        </section>

        <section id="find-us" className="pb-20">
          <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-10 px-3 sm:px-5 md:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">Sushi Bai Kiyoshi</h2>
              <p className="mt-7 text-base uppercase tracking-[0.14em] text-stone-700 md:text-lg">Monday - Friday: Time - Time</p>

              <h3 className="mt-12 text-3xl font-bold uppercase tracking-tight md:text-4xl">Sign Up Today</h3>
              <p className="mt-3 text-base text-stone-500">Lorem ipsum dolor sit amet</p>
              <input
                type="text"
                placeholder="Enter your text here"
                className="mt-4 w-full border border-stone-400 bg-white px-4 py-3 text-lg text-stone-500 outline-none"
              />
              <button className="mt-4 bg-black px-8 py-3 text-lg font-semibold text-white">Click here!</button>
            </div>

            <div>
              <p className="mb-5 text-center text-xl font-semibold uppercase leading-tight tracking-[0.1em] text-stone-700 md:text-2xl">
                Agaj Street, 245 - SDJS City
                <br />
                Happy Place
              </p>
              <div className="flex min-h-[320px] items-center justify-center border border-stone-300 bg-white text-sm text-stone-400">
                Map goes here
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
