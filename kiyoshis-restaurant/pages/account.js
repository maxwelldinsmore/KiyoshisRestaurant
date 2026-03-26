import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const rewards = [
  "15% Discount",
  "Free Single Server",
  "Free Single Server+",
  "50% Discount",
];

function RewardCard({ title }) {
  return (
    <div>
      <p className="mb-2 text-xl font-semibold">{title}</p>
      <div className="flex h-32 items-center justify-center rounded-md border border-gray-300 bg-gray-200 text-sm text-gray-500">
        Reward Image
      </div>
    </div>
  );
}

function AccountField({ label, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="block text-lg font-semibold md:text-xl">{label}</label>
      <input
        placeholder={placeholder}
        className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3 text-base text-gray-700 outline-none focus:border-black"
      />
    </div>
  );
}

export default function AccountPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/user", {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json().catch(() => ({}));
        setUser(data?.user ?? null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setUser(null);
      });

    return () => controller.abort();
  }, []);

  const displayName = useMemo(() => {
    if (!user?.firstName) return "there";
    return user.firstName;
  }, [user]);

  const placeholders = {
    firstName: user?.firstName || "First name",
    lastName: user?.lastName || "Last name",
    email: user?.email || "Email",
    phone: user?.phoneNumber || "Phone number",
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Head>
        <title>Account | Sushi Bai Kiyoshi</title>
      </Head>

      <Header active="account" userName={user?.firstName || ""} />

      <main className="flex-1 bg-[#edf1f7]">
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Account</h1>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-gray-500">Hello, {displayName}. Click to update fields</p>

          <div className="mt-10 grid grid-cols-1 gap-5 rounded-md border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2 lg:grid-cols-4">
            <AccountField label="First Name" placeholder={placeholders.firstName} />
            <AccountField label="Last Name" placeholder={placeholders.lastName} />
            <AccountField label="Email" placeholder={placeholders.email} />
            <AccountField label="Phone Number" placeholder={placeholders.phone} />
          </div>

          <div className="mt-14 text-center md:mt-16">
            <h2 className="text-5xl font-bold tracking-tight md:text-6xl">Loyalty</h2>
            <p className="mt-3 text-2xl md:text-3xl">Earn points after every purchase</p>
          </div>

          <div className="mt-8">
            <div className="flex h-12 items-center justify-around rounded-sm bg-gray-200 text-lg font-semibold text-gray-500">
              <span>0</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
            </div>
            <div className="relative mt-2 h-2 rounded-sm bg-gray-300">
              <div className="absolute left-0 top-0 h-2 w-[8%] bg-black" />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 items-start gap-4 md:grid-cols-5">
            <p className="text-2xl font-semibold leading-tight md:col-span-2 md:text-3xl lg:col-span-1">
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
