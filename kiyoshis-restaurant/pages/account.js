import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

const rewards = [
  "15% Discount",
  "Free Single Server",
  "Free Single Server+",
  "50% Discount",
];

function RewardCard({ title }) {
  return (
    <div>
      <p className="text-xl font-semibold mb-2">{title}</p>
      <div className="h-32 bg-gray-200 border border-gray-300 rounded-md flex items-center justify-center text-gray-500 text-sm">
        Reward Image
      </div>
    </div>
  );
}

function AccountField({ label, value }) {
  return (
    <div className="space-y-2">
      <label className="block text-lg md:text-xl font-semibold">{label}</label>
      <input
        defaultValue={value}
        className="w-full border border-gray-300 bg-white px-4 py-3 text-base text-gray-700 rounded-sm outline-none focus:border-black"
      />
    </div>
  );
}

export default function AccountPage() {
  return (
    <div className={inter.className}>
      <Head>
        <title>Account | Sushi Bai Kiyoshi</title>
      </Head>

      <Header active="account" userName="Ben" />

      <main className="bg-[#f6f6f1] min-h-screen">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Account</h1>
          <p className="text-gray-500 tracking-[0.2em] uppercase text-sm mt-2">Click to update fields</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 bg-white border border-gray-200 rounded-md p-6 shadow-sm">
            <AccountField label="First Name" value="Ben" />
            <AccountField label="Last Name" value="Example" />
            <AccountField label="Email" value="fake@email.com" />
            <AccountField label="Phone Number" value="234-145-6767" />
          </div>

          <div className="text-center mt-14 md:mt-16">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Loyalty</h2>
            <p className="text-2xl md:text-3xl mt-3">Earn points after every purchase</p>
          </div>

          <div className="mt-8">
            <div className="bg-gray-200 h-12 rounded-sm flex items-center justify-around text-gray-500 text-lg font-semibold">
              <span>0</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
            </div>
            <div className="h-2 bg-gray-300 mt-2 rounded-sm relative">
              <div className="absolute left-0 top-0 h-2 w-[8%] bg-black" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-10 items-start">
            <p className="text-2xl md:text-3xl font-semibold leading-tight md:col-span-2 lg:col-span-1">
              Sign up &
              <br />
              become a
              <br />
              member to
              <br />
              unlock rewards
              <br />
              today!
            </p>
            {rewards.map((reward) => (
              <RewardCard key={reward} title={reward} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}