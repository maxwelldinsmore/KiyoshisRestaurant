import Head from "next/head";
import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function FindUsPage() {
  return (
    <>
      <Head>
        <title>Find Us | Sushi Bai Kiyoshi</title>
        <meta
          name="description"
          content="Find Sushi Bai Kiyoshi in downtown Toronto, with opening hours, location details, and tips for planning your visit."
        />
      </Head>

      <InfoPageLayout
        active="findUs"
        theme="cool"
        title="Find Us"
        eyebrow="Visit The Restaurant"
        subtitle="Plan your visit with clear directions, opening hours, and a quick overview of what to expect when you arrive downtown."
        heroQuote="A calm arrival makes the whole dining experience feel better from the start."
        heroImage="/Website/9.jpg"

        mainSections={[
          {
            title: "Where We Are",
            paragraphs: [
              "Sushi Bai Kiyoshi is located at 128 Simcoe Street in Toronto, positioned for convenient access from nearby offices, transit routes, and the downtown core.",
              "The restaurant is well suited for quick lunch visits, planned dinner reservations, and relaxed evening dining after work or events in the city.",
            ],
            image: "/Website/map.png",
          },
        ]}
        sidebarSections={[
          {
            title: "Visit Details",
            items: [
              { label: "Address", value: "128 Simcoe Street, Toronto, ON M5H 3G5" },
              { label: "Phone", value: "(416) 555-0148" },
              { label: "Email", value: "hello@sushibaikiyoshi.com" },
            ],
          },

        ]}
      />
    </>
  );
}
