import Head from "next/head";
import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>Frequently Asked Questions | Sushi Bai Kiyoshi</title>
        <meta
          name="description"
          content="Browse common questions about online pickup orders, guest checkout, loyalty rewards, payment options, and using the Sushi Bai Kiyoshi website."
        />
      </Head>

      <InfoPageLayout
        theme="cool"
        faqFullWidth
        heroImageLeft
        title="Frequently Asked Questions"
        eyebrow="Ordering Help"
        subtitle="Your quick guide to how Sushi Bai Kiyoshi's online ordering works from pickup times and guest checkout to loyalty rewards and account features. This FAQ focuses on the practical questions customers actually ask, like when they can order, how pickup slots are assigned, whether an account is required, and what happens once an order is placed."
        heroQuote="Clarity and calm are part of hospitality too."
        heroImage="/Website/10.jpg"

        faqItems={[
          {
            question: "Can I place an order without creating an account?",
            answer:
              "Yes. Customers should be able to place an order as a guest. Guest checkout still requires a phone number so the restaurant can contact you if something affects pickup.",
          },
          {
            question: "Can I choose my pickup date and time?",
            answer:
              "Yes. The system should only show pickup slots that are available. Customers can place orders for the same day, or up to one day in advance, based on the configured ordering window.",
          },
          {
            question: "When does online ordering stop for the day?",
            answer:
              "Same-day online ordering should stop 30 minutes before closing. Orders for the following day should stop being accepted after 9:00 PM.",
          },
          {
            question: "Can I change my order after I submit it?",
            answer:
              "No. Once submitted, an order should not be editable. Customers must cancel the order and place a new one if a change is needed.",
          },
          {
            question: "How can I pay for my order?",
            answer:
              "Customers should be able to pay online before pickup or choose to pay at pickup using supported payment methods such as cash or card.",
          },
          {
            question: "What do I get if I create an account?",
            answer:
              "Account holders can join the loyalty program, track reward history, view upcoming rewards, save favourites, and receive optional promotions and order updates.",
          },
          {
            question: "Will I know when my order is ready?",
            answer:
              "That is part of the planned experience. Customers should be able to see an estimated ready time, receive payment confirmation, and get notified when food is ready for pickup.",
          },
          {
            question: "Can I place orders far in advance?",
            answer:
              "Orders can be placed up to one day in advance. This helps keep pickup windows accurate and manageable for the kitchen.",
          },
          {
            question: "Can I update my profile details if I have an account?",
            answer:
              "Yes. Registered customers should be able to update key profile details, including phone number and email, so order communication stays accurate.",
          },
          {
            question: "Are promotional messages required to use the service?",
            answer:
              "No. Promotional messages should remain optional, and users should have a clear unsubscribe path.",
          },
          {
            question: "How should allergy or ingredient concerns be handled?",
            answer:
              "Allergy-related questions are best handled before order submission so staff can confirm options and pickup details safely.",
          },
        ]}
      />
    </>
  );
}
