import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

function FormField({ label, placeholder = "", required = true }) {
  return (
    <div className="space-y-2">
      <label className="block text-xl md:text-2xl font-semibold">{label}</label>
      <input
        type="text"
        defaultValue={placeholder}
        className="w-full border border-gray-300 bg-white px-4 py-3 text-base rounded-sm outline-none focus:border-black"
      />
      {required ? <p className="text-red-400 text-sm">This field is required</p> : null}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className={inter.className}>
      <Head>
        <title>Register | Sushi Bai Kiyoshi</title>
      </Head>

      <Header active="register" />

      <main className="bg-[#f6f6f1] min-h-screen">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <h1 className="text-5xl md:text-6xl font-bold text-center tracking-tight">Register</h1>
          <p className="text-center text-gray-500 tracking-[0.2em] uppercase mt-4 text-sm">
            Enter your details below to create an account
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mt-12 bg-white border border-gray-200 rounded-md p-6 md:p-8 shadow-sm">
            <FormField label="First Name" />
            <FormField label="Last Name" />
            <FormField label="Email" />
            <FormField label="Phone Number" />
          </div>

          <div className="text-center mt-12">
            <button className="bg-black text-white px-12 py-3 text-sm uppercase tracking-[0.25em] rounded-sm hover:bg-gray-800 transition-colors">
              Sign Up
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}