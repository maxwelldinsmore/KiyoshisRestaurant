import Head from "next/head";
import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function ContactUsPage() {
  return (
    <>
      <Head>
        <title>Contact Us | Sushi Bai Kiyoshi</title>
        <meta
          name="description"
          content="Contact Sushi Bai Kiyoshi for online order support, pickup questions, loyalty help, and general restaurant enquiries."
        />
      </Head>

      <InfoPageLayout
        theme="cool"
        title="Contact Us"
        eyebrow="Order Support"
        subtitle="This page is your central support hub for online orders, phone orders, and in-person questions before pickup."
        heroQuote="Good service starts before pickup time arrives."
        heroImage="/Website/15.jpg"
        mainSections={[
          {
            title: " Contact Details",
            paragraphs: [
              "Use these details first when you need to reach Sushi Bai Kiyoshi.",
              "For the fastest experience, place online orders through the website and call directly for urgent same-day help.",
            ],
            items: [
              { label: "Address", value: "128 Simcoe Street, Toronto, ON M5H 3G5" },
              { label: "Phone", value: "(416) 555-0148" },
              { label: "Email", value: "hello@sushibaikiyoshi.com" },
              { label: "Online Orders", value: "Browse the menu and choose a pickup time on the website" },
            ],
          },
        ]}
        sidebarSections={[
          {
            title: "Restaurant Hours",
            image: "/Website/14.jpg",
            items: [
              { label: "Monday to Thursday", value: "11:30 AM to 9:30 PM" },
              { label: "Friday and Saturday", value: "11:30 AM to 10:30 PM" },
              { label: "Sunday", value: "12:00 PM to 8:30 PM" },
            ],
            note: "Same-day online orders close 30 minutes before closing.",
          },
        ]}
      />
    </>
  );
}
