import Head from "next/head";
import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Sushi Bai Kiyoshi</title>
        <meta
          name="description"
          content="Review how Sushi Bai Kiyoshi handles customer information for online pickup orders, accounts, loyalty features, and notifications."
        />
      </Head>

      <InfoPageLayout
        theme="cool"
        heroImageLeft
        mainSectionsFullWidth
        title="Privacy Policy"
        eyebrow="Customer Privacy"
        subtitle="Sushi Bai Kiyoshi protects customer information through responsible data handling across ordering, support, and website use, using collected data to operate and improve the ordering experience and communication, while applying administrative, technical, and physical safeguards to reduce risk."
        intro="Last updated: March 22, 2026."
        heroQuote="Discretion is a quiet form of hospitality."
        heroImage="/Website/14.jpg"

        mainSections={[
          {
            title: "Information We Collect",
            paragraphs: [
              "We collect information you provide directly, information collected automatically while browsing, and information related to marketing preferences when you subscribe.",
              "Payment details are processed securely by third-party providers, and full card details are not stored by Sushi Bai Kiyoshi.",
            ],
            table: {
              columns: ["Category", "Details"],
              rows: [
                [
                  "Direct information",
                  "Name, email, phone number, pickup or delivery address, order details, and support messages.",
                ],
                [
                  "Automatic information",
                  "IP address, browser and device details, pages viewed, time on site, and cookie data.",
                ],
                [
                  "Marketing information",
                  "Email address and communication preferences for newsletters and promotions.",
                ],
              ],
            },
          },
          {
            title: "How We Use and Share Information",
            paragraphs: [
              "Information is used to fulfill online orders, share order updates, provide customer support, improve website performance, and meet legal obligations.",
              "We do not sell personal information. Information may be shared with trusted service providers when needed to run restaurant operations.",
            ],
            table: {
              columns: ["Area", "How It Is Used or Shared"],
              rows: [
                [
                  "Primary use",
                  "Order fulfillment, support, promotions with consent, fraud prevention, and site security.",
                ],
                [
                  "Possible sharing",
                  "Payment processors, delivery partners (if used), email marketing platforms, analytics providers, and law enforcement when required by law.",
                ],
                [
                  "Partner obligation",
                  "All third-party partners are expected to protect customer information.",
                ],
              ],
            },
          },
          {
            title: "Security, Cookies, and Your Rights",
            paragraphs: [
              "Security controls include encrypted payment processing, secure hosting, limited data access, and regular security monitoring. No internet transmission method is fully risk-free.",
              "Cookies support site performance, preferences, analytics, and ordering functionality. You can manage cookies in browser settings, though some features may be affected.",
            ],
            table: {
              columns: ["Topic", "Your Rights or Policy Terms"],
              rows: [
                [
                  "Access and corrections",
                  "You may request access to your personal information and request corrections.",
                ],
                [
                  "Marketing consent",
                  "You may withdraw consent for marketing communication at any time.",
                ],
                [
                  "Deletion requests",
                  "You may request deletion of certain information, subject to legal requirements.",
                ],
                [
                  "Third-party links",
                  "The website may link to third-party websites, and their privacy practices are separate.",
                ],
                [
                  "Policy updates",
                  "This policy may be updated periodically with a revised last-updated date.",
                ],
              ],
            },
          },
        ]}
      />
    </>
  );
}
