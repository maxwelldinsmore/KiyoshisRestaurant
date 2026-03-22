import Head from "next/head";
import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms and Conditions | Sushi Bai Kiyoshi</title>
        <meta
          name="description"
          content="Read the terms for using the Sushi Bai Kiyoshi website, including online pickup ordering, accounts, payments, and loyalty features."
        />
      </Head>

      <InfoPageLayout
        theme="cool"
        mainSectionsFullWidth
        title="Terms and Conditions"
        eyebrow="Ordering Terms"
        subtitle="Sushi Bai Kiyoshi's Terms & Conditions outline how customers may use the Sushi Bai Kiyoshi website, including how online pickup orders, payment options, guest checkout, account features, and loyalty tools function in practice. They explain what customers can expect from the ordering system such as pickup slot availability, payment rules, and limits on changes after an order is submitted to ensure a smooth and reliable experience."
        heroQuote="Clear rules create a smoother path for everyone at the table."
        heroImage="/Website/12.jpg"

        mainSections={[
          {
            title: "Using The Website",
            paragraphs: [
              "By using this website, you agree to use it for legitimate browsing, online ordering, account access, communication, and restaurant-related activity only.",
              "You should not attempt to bypass security, submit false customer information, interfere with ordering workflows, or misuse any part of the site intended for staff or owner operations.",
            ],
            items: [
              {
                label: "Lawful Use",
                value: "Use the website in accordance with applicable laws and reasonable community standards.",
              },
              {
                label: "Security Respect",
                value: "Do not attempt to bypass security features or misuse application routes and forms.",
              },
              {
                label: "Accurate Information",
                value: "Do not submit false account details, false orders, or disruptive content.",
              },
            ],
          },
          {
            title: "Orders, Pickup Times, And Accounts",
            paragraphs: [
              "The online ordering system is built around pickup scheduling and operational limits. Customers should only be able to choose available pickup slots, and those limits may become stricter during lunch rush hours or other busy periods.",
              "Customers may place orders as guests or as registered members. If you create an account, you remain responsible for keeping your profile accurate and protecting your login credentials.",
            ],
            items: [
              {
                label: "Advance Window",
                value: "Orders may be placed up to one day in advance only.",
              },
              {
                label: "Same-Day Cutoff",
                value: "Same-day orders should stop 30 minutes before closing.",
              },
              {
                label: "Next-Day Cutoff",
                value: "Next-day orders should stop after 9:00 PM.",
              },
              {
                label: "Order Changes",
                value: "Customers cannot modify an order once it has been submitted; they must cancel and place a new one.",
              },
              {
                label: "Account Security",
                value: "Guests should keep account credentials confidential and up to date.",
              },
              {
                label: "Access Controls",
                value: "The restaurant may suspend access where misuse, fraud, or security concerns are reasonably suspected.",
              },
            ],
          },
          {
            title: "Payments, Notifications, And Service Changes",
            paragraphs: [
              "Customers may be offered a choice between paying online before pickup and paying at pickup. Payment confirmation, ready notifications, and promotional updates are part of the intended service experience, although some communication features may depend on system configuration and third-party integrations.",
              "Menu items, pricing, availability, promotions, loyalty thresholds, and online ordering access may change as the restaurant adjusts operations, staffing, or system settings.",
            ],
            items: [
              {
                label: "Peak Limits",
                value: "Online ordering may be limited automatically during peak periods.",
              },
              {
                label: "Owner Controls",
                value: "The owner may control discounts, loyalty thresholds, and menu availability.",
              },
              {
                label: "Role-Based Access",
                value: "Staff access may be restricted by role, especially for pricing, inventory, and discount controls.",
              },
              {
                label: "Content Updates",
                value: "Content may be revised to reflect menu, policy, or feature changes.",
              },
              {
                label: "Acceptance",
                value: "Continued use of the site after updates may indicate acceptance of revised terms.",
              },
              {
                label: "Questions",
                value: "Questions about these terms should be directed to the restaurant before continued use if clarification is needed.",
              },
            ],
          },
        ]}
      />
    </>
  );
}
