import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = { className: "" };

const specials = [
  { title: "Lorem ipsum dolor 1", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 2", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 3", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 4", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 5", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 6", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 7", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 8", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
];

const favourites = [
  { title: "Lorem ipsum dolor 1", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 2", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 3", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 4", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 5", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 6", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 7", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
  { title: "Lorem ipsum dolor 8", text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urnaex." },
];

const carouselSlides = [
  {
    title: "Lorem ipsum dolor sit amet",
    text: "Aenean consectetur odio in condimentum tristique. Nam hendrerit urna exon.",
    image: "/Website/9.jpg",
  },
  {
    title: "Fresh ingredients. Bold flavor.",
    text: "Use this slide for your second hero message once images are added.",
    image: "/Website/10.jpg",
  },
  {
    title: "Crafted daily in our kitchen",
    text: "Use this slide for promotions, daily specials, or chef highlights.",
    image: "/Website/11.jpg",
  },
  {
    title: "Crafted daily in our kitchen",
    text: "Use this slide for promotions, daily specials, or chef highlights.",
    image: "/Website/13.jpg",
  },
];

// Simple fallback image component for carousel
function CarouselImage({ src, alt, fallback, style, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => {
    setImgSrc(src);
  }, [src]);
  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== fallback) setImgSrc(fallback);
      }}
      style={{
        objectFit: "cover",
        objectPosition: "center",
        width: "100%",
        height: "100%",
        background: "#222",
        ...style,
      }}
    />
  );
}

export default function Home() {
  const [slideIndex, setSlideIndex] = useState(0);
  const specialsRef = useRef(null);
  const favouritesRef = useRef(null);
  const scrollCards = (ref, dir) => {
    const el = ref.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (dir === 1 && el.scrollLeft >= maxScroll - 1) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir === -1 && el.scrollLeft <= 1) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
    }
  };
  const currentSlide = carouselSlides[slideIndex];

  const previousSlide = () => {
    setSlideIndex((current) => (current === 0 ? carouselSlides.length - 1 : current - 1));
  };

  const nextSlide = () => {
    setSlideIndex((current) => (current === carouselSlides.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <Head>
        <title>Sushi Bai Kiyoshi</title>
        <meta name="description" content="Sushi Bai Kiyoshi restaurant homepage" />
      </Head>

      <Header />

      <main className="flex-1 bg-[#edf1f7] text-stone-950">
        <div className="w-full">

          {/* Hero Banner */}
          <section className="border-b border-stone-300 bg-[#edf1f7]">
            <div className="pb-8 px-8">
              <div className="relative h-[500px] overflow-hidden border border-stone-300 bg-white sm:h-[600px] md:h-[850px]">
                <Image
                  src="/SushiBaiKiyoshiBanner3.png"
                  alt="Sushi Bai Kiyoshi hero banner"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* Carousel */}
          <section className="pb-10 sm:pb-14">
            <div className="max-w-[92rem] mx-auto px-8">
              <div className="relative overflow-hidden border border-stone-300 bg-black text-white" style={{ height: "600px", minHeight: "400px" }}>
                <CarouselImage
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fallback="/fallback-carousel.jpg"
                  style={{ position: "absolute", inset: 0, zIndex: 0 }}
                />
                <div className="absolute inset-0 bg-black/35 z-10" />
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-20">
                  <h2 className="text-4xl font-bold tracking-tight">{currentSlide.title}</h2>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-stone-100">
                    {currentSlide.text}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={previousSlide}
                  aria-label="Previous slide"
                  className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/40 text-2xl transition-colors hover:bg-black/65 z-20"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/40 text-2xl transition-colors hover:bg-black/65 z-20"
                >
                  ›
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-20">
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

          {/* Today's Specials */}
          <section className="pt-3 pb-14 sm:pt-1 sm:pb-16">
            <div className="max-w-[92rem] mx-auto px-8">
              <h2 className="text-center text-5xl font-bold tracking-tight">Today&apos;s Specials</h2>
              <div className="relative mt-10 px-12">
                <button
                  onClick={() => scrollCards(specialsRef, -1)}
                  aria-label="Scroll left"
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center border border-stone-300 bg-white text-2xl shadow-sm hover:bg-stone-100"
                >‹</button>
                <div
                  ref={specialsRef}
                  className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {specials.map((item, index) => (
                    <article key={`special-${index}`} className="snap-start shrink-0 w-[calc(25%-1.125rem)] border border-stone-300 bg-white p-4">
                      <div className="flex h-32 items-center justify-center border border-stone-300 bg-stone-100 text-sm text-stone-400">
                        Add image
                      </div>
                      <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-500">{item.text}</p>
                    </article>
                  ))}
                </div>
                <button
                  onClick={() => scrollCards(specialsRef, 1)}
                  aria-label="Scroll right"
                  className="absolute right-1 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center border border-stone-300 bg-white text-2xl shadow-sm hover:bg-stone-100"
                >›</button>
              </div>
            </div>
          </section>

          {/* Fan Favourites */}
          <section className="pt-3 pb-12 sm:pt-1 sm:pb-16">
            <div className="max-w-[92rem] mx-auto px-8">
              <h2 className="text-center text-5xl font-bold tracking-tight">Fan Favourites</h2>
              <div className="relative mt-10 px-12">
                <button
                  onClick={() => scrollCards(favouritesRef, -1)}
                  aria-label="Scroll left"
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center border border-stone-300 bg-white text-2xl shadow-sm hover:bg-stone-100"
                >‹</button>
                <div
                  ref={favouritesRef}
                  className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {favourites.map((item, index) => (
                    <article key={`fav-${index}`} className="snap-start shrink-0 w-[calc(25%-1.125rem)] border border-stone-300 bg-white p-4">
                      <div className="flex h-32 items-center justify-center border border-stone-300 bg-stone-100 text-sm text-stone-400">
                        Add image
                      </div>
                      <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-500">{item.text}</p>
                    </article>
                  ))}
                </div>
                <button
                  onClick={() => scrollCards(favouritesRef, 1)}
                  aria-label="Scroll right"
                  className="absolute right-1 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center border border-stone-300 bg-white text-2xl shadow-sm hover:bg-stone-100"
                >›</button>
              </div>
            </div>
          </section>

          {/* Loyalty */}
          <section className="pt-3 pb-12 sm:pt-1 sm:pb-16">
            <div className="max-w-[92rem] mx-auto px-8">
              <div className="border border-stone-300 bg-white p-6 text-center">
                <p className="text-2xl font-semibold tracking-tight md:text-3xl">Become Apart of our loyalty program and earn points!</p>
              </div>
              <div className="relative mt-6 h-96 md:h-[480px] overflow-hidden">
                <img src="/Website/17.jpg" alt="Loyalty program" className="w-full h-full object-cover" style={{ objectPosition: "center 85%" }} />
                <div className="absolute top-0 left-0 w-full text-center pt-6">
                  <button className="bg-[#152d4b] px-10 py-3 text-base font-semibold text-white">Sign Up</button>
                </div>
              </div>
            </div>
          </section>

          {/* Find Us */}
          <section id="find-us" className="pb-20">
            <div className="max-w-[92rem] mx-auto px-8">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <div>
                  <h2 className="text-6xl font-bold leading-tight tracking-tight md:text-5xl">Sushi Bai Kiyoshi</h2>
                  <p className="mt-14 text-base uppercase tracking-widest text-stone-500">Come by!</p>
                  <p className="mt-1 text-lg uppercase tracking-[0.14em] text-stone-700 md:text-xl">Monday - Friday: Time - Time</p>

                  <h3 className="mt-20 text-4xl font-bold uppercase tracking-tight md:text-3xl">Sign Up Today</h3>
                  <p className="mt-3 text-lg text-stone-500">Be the first to discover new rolls, chef's specials, and members‑only promotions crafted just for you.</p>
                  <input
                    type="text"
                    placeholder="Enter your text here"
                    className="mt-4 w-full border border-stone-400 bg-white px-4 py-3 text-xl text-stone-500 outline-none"
                  />
                  <button className="mt-4 bg-[#152d4b] px-8 py-3 text-xl font-semibold text-white">Click here!</button>
                </div>

                <div>
                  <h3 className="text-center text-2xl font-bold tracking-tight md:text-4xl">Find Us</h3>
                  <div className="mt-4 space-y-1 text-base text-stone-600 text-right">
                    <p className="font-bold">128 Simcoe Street</p>
                    <p className="font-bold">Toronto, ON M5H 3G5</p>
                    <p>Located at the north end of Simcoe Street in Toronto’s Financial District</p>
                  </div>
                  <div className="mt-4 overflow-hidden border border-stone-300">
                    <img src="/Website/map.png" alt="Map to Sushi Bai Kiyoshi" className="w-full h-auto object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
