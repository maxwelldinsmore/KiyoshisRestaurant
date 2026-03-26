import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    contactMethod: 'Email',
    promoEmail: false,
    promoSMS: false,
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, success: false, message: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (success, message) => {
    setToast({ show: true, success, message });
    if (!success) setTimeout(() => setToast({ show: false, success: false, message: '' }), 4000);
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    if (!form.lastName.trim()) e.lastName = 'Last name is required.';
    if (!form.email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email address.';
    }
    if (!form.phone.trim()) {
      e.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      e.phone = 'Phone must be 10 digits.';
    }
    if (!form.password) {
      e.password = 'Password is required.';
    } else if (form.password.length < 8) {
      e.password = 'Password must be at least 8 characters.';
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone.replace(/\D/g, ''),
          contactMethod: form.contactMethod,
          promoOptIn: form.promoEmail || form.promoSMS,
          password: form.password,
        }),
      });

      let data = {};
      try { data = await res.json(); } catch { /* non-JSON response */ }

      if (res.ok) {
        showToast(true, 'Account created! Redirecting to sign in...');
        setTimeout(() => router.push('/signIn'), 2500);
      } else {
        showToast(false, data?.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Register error:', err);
      showToast(false, 'Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <Head>
        <title>Register | Sushi Bai Kiyoshi</title>
      </Head>

      <Header active="register" />

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 text-white text-sm font-semibold shadow-lg transition-all ${
            toast.success ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <main className="flex-1 bg-[#edf1f7]">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight">Register</h1>
          <p className="text-center text-gray-500 tracking-[0.2em] uppercase mt-2 text-sm">
            Enter your details below to create an account
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-6 bg-white border border-gray-200 rounded-md p-5 md:p-6 shadow-sm">

              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-xl md:text-2xl font-semibold">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  aria-label="First Name"
                  title="Enter your first name"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  maxLength={30}
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-base rounded-sm outline-none focus:border-black"
                />
                {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-xl md:text-2xl font-semibold">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  aria-label="Last Name"
                  title="Enter your last name"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  maxLength={30}
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-base rounded-sm outline-none focus:border-black"
                />
                {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xl md:text-2xl font-semibold">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  aria-label="Email address"
                  title="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-base rounded-sm outline-none focus:border-black"
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-xl md:text-2xl font-semibold">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  aria-label="Phone number"
                  title="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-base rounded-sm outline-none focus:border-black"
                />
                {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-xl md:text-2xl font-semibold">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  aria-label="Password"
                  title="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-base rounded-sm outline-none focus:border-black"
                />
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>

              {/* Promo Opt-In */}
              <div className="space-y-3">
                <label className="block text-xl md:text-2xl font-semibold">Promotions</label>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Receive special offers and news from Sushi Bai Kiyoshi via:
                </p>
                <div className="flex items-center gap-6 pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="promoEmail"
                      aria-label="Promotion Email"
                      title="Receive promotion via email"
                      id="promoEmail"
                      checked={form.promoEmail}
                      onChange={handleChange}
                      className="h-4 w-4 accent-black"
                    />
                    <label htmlFor="promoEmail" className="text-sm font-semibold text-gray-700">Email</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="promoSMS"
                      aria-label="Promotion SMS"
                      title="Receive promotion via SMS"
                      id="promoSMS"
                      checked={form.promoSMS}
                      onChange={handleChange}
                      className="h-4 w-4 accent-black"
                    />
                    <label htmlFor="promoSMS" className="text-sm font-semibold text-gray-700">Text (SMS)</label>
                  </div>
                </div>
              </div>

            </div>

            <div className="text-center mt-6 space-y-3">
              <button
                type="submit"
                title="Sign Up"
                disabled={loading}
                className="bg-black text-white px-12 py-3 text-sm uppercase tracking-[0.25em] rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/signIn" className="font-semibold text-black hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}