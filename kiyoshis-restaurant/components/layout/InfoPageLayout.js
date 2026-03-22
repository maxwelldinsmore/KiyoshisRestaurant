import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InfoFaqSection from "@/components/layout/FaqSection";
import InfoMainSection from "@/components/layout/FaqContentSection";
import InfoSidebarSection from "@/components/layout/sidebarSection";
import { infoPageThemes } from "@/components/layout/theme";

export default function InfoPageLayout({
  active = "",
  title,
  eyebrow,
  subtitle,
  intro,
  heroQuote,
  heroImage,
  featureCards = [],
  mainSections = [],
  sidebarSections = [],
  faqItems = [],
  faqFullWidth = false,
  heroImageLeft = false,
  mainSectionsFullWidth = false,
  theme = "warm",
}) {
  const palette = infoPageThemes[theme] ?? infoPageThemes.warm;
  const hasContentSections = mainSections.length > 0 || sidebarSections.length > 0;
  const hasSidebarSections = sidebarSections.length > 0;
  const splitContentLayout = !mainSectionsFullWidth && hasSidebarSections;

  return (
    <div className="min-h-dvh flex flex-col bg-[#edf1f7] text-stone-950">
      <Header active={active} title={title} />

      <main className={`relative flex-1 overflow-hidden ${palette.pageBackground}`} aria-label={`${title} page`}>
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: palette.overlayPattern,
            backgroundSize: "auto, auto, 36px 36px, 36px 36px",
          }}
        />

        <section className={`relative border-b ${palette.panelBorder}`}>
          <div className="mx-auto grid max-w-[92rem] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-14">
            <div className={`self-center ${heroImageLeft ? "lg:order-2" : ""}`}>
              <p className={`text-xs uppercase tracking-[0.36em] ${palette.eyebrow}`}>{eyebrow}</p>
              <h1 className={`mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl ${palette.heading}`}>{title}</h1>
              <p className={`mt-5 max-w-2xl text-xl leading-9 ${palette.subtitle}`}>{subtitle}</p>
              <p className={`mt-5 max-w-2xl text-base leading-8 ${palette.mutedText}`}>{intro}</p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {featureCards.map((card) => (
                  <article key={card.title} className={`border bg-white/80 p-4 shadow-[0_12px_30px_rgba(58,35,25,0.06)] backdrop-blur-sm ${palette.featureBorder}`}>
                    <p className={`text-xs uppercase tracking-[0.26em] ${palette.featureAccent}`}>{card.kicker}</p>
                    <h2 className={`mt-3 text-lg font-semibold ${palette.sectionHeading}`}>{card.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-stone-700">{card.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className={`relative min-h-[320px] overflow-hidden border shadow-[0_30px_80px_rgba(34,21,18,0.18)] sm:min-h-[420px] ${palette.heroFrame} ${heroImageLeft ? "lg:order-1" : ""}`}>
              <Image
                src={heroImage}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className={`absolute inset-0 ${palette.heroOverlay}`} />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className={`w-fit border px-4 py-2 text-xs uppercase tracking-[0.28em] backdrop-blur-sm ${palette.heroLabel}`}>
                  Traditional Japanese Spirit
                </div>
                <p className="mt-4 max-w-md text-2xl leading-9 text-[#fff8ef] sm:text-3xl">{heroQuote}</p>
              </div>
            </div>
          </div>
        </section>

        {hasContentSections ? (
          <section className={`relative mx-auto max-w-[92rem] gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 ${splitContentLayout ? "grid lg:grid-cols-[1.25fr_0.75fr]" : ""}`}>
            <div className="space-y-6">
              {mainSections.map((section) => (
                <InfoMainSection
                  key={section.title}
                  title={section.title}
                  paragraphs={section.paragraphs}
                  list={section.list}
                  items={section.items}
                  table={section.table}
                  image={section.image}
                  theme={palette}
                />
              ))}
              {!faqFullWidth ? <InfoFaqSection items={faqItems} theme={palette} /> : null}
            </div>

            {splitContentLayout ? (
              <aside className="space-y-6 lg:pt-8">
                {sidebarSections.map((section) => (
                  <InfoSidebarSection
                    key={section.title}
                    title={section.title}
                    items={section.items}
                    note={section.note}
                    image={section.image}
                    theme={palette}
                  />
                ))}
              </aside>
            ) : null}
          </section>
        ) : faqFullWidth ? null : (
          <section className="relative mx-auto max-w-[92rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <InfoFaqSection items={faqItems} theme={palette} />
          </section>
        )}

        {faqFullWidth ? (
          <section className="relative mx-auto max-w-[92rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <InfoFaqSection items={faqItems} theme={palette} />
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
