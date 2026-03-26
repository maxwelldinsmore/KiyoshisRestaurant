import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SignInPage() {
  const router = useRouter();

  const [loginMethod, setLoginMethod] = useState('email');
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, success: false, message: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (success, message) => {
    setToast({ show: true, success, message });
    if (!success) setTimeout(() => setToast({ show: false, success: false, message: '' }), 4000);
  };

  const switchMethod = (method) => {
    setLoginMethod(method);
    setForm({ identifier: '', password: '' });
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!form.identifier.trim()) {
      e.identifier = loginMethod === 'email' ? 'Email is required.' : 'Phone number is required.';
    } else if (loginMethod === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.identifier)) {
      e.identifier = 'Please enter a valid email address.';
    } else if (loginMethod === 'phone' && !/^\d{10}$/.test(form.identifier.replace(/\D/g, ''))) {
      e.identifier = 'Phone must be 10 digits.';
    }
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      const payload =
        loginMethod === 'email'
          ? { email: form.identifier, password: form.password }
          : { phone: form.identifier.replace(/\D/g, ''), password: form.password };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data = {};
      try { data = await res.json(); } catch { /* non-JSON response */ }

      if (res.ok) {
        showToast(true, `Welcome back, ${data.user.firstName}!`);
        setTimeout(() => router.push('/account'), 2000);
      } else {
        showToast(false, data?.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      showToast(false, 'Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <Head>
        <title>Sign In | Sushi Bai Kiyoshi</title>
      </Head>

      <Header active="signIn" />

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
          <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight">Sign In</h1>
          <p className="text-center text-gray-500 tracking-[0.2em] uppercase mt-2 text-sm">
            Welcome back — enter your details below
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-y-5 mt-6 bg-white border border-gray-200 rounded-md p-5 md:p-6 shadow-sm">

              {/* Login method toggle */}
              <div className="flex gap-1 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => switchMethod('email')}
                  className={`px-5 py-2 text-sm font-semibold tracking-wide transition-colors border-b-2 -mb-px ${
                    loginMethod === 'email'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => switchMethod('phone')}
                  className={`px-5 py-2 text-sm font-semibold tracking-wide transition-colors border-b-2 -mb-px ${
                    loginMethod === 'phone'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Phone Number
                </button>
              </div>

              {/* Identifier input */}
              <div className="space-y-2">
                <label className="block text-xl md:text-2xl font-semibold">
                  {loginMethod === 'email' ? 'Email' : 'Phone Number'}{' '}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type={loginMethod === 'email' ? 'email' : 'tel'}
                  name="identifier"
                  aria-label={
                    loginMethod === 'email'
                        ? 'Email address'
                        : 'Phone number'
                  }
                  title={
                    loginMethod === 'email'
                        ? 'Enter your email address'
                        : 'Enter your phone number'
                  }
                  value={form.identifier}
                  onChange={handleChange}
                  placeholder={loginMethod === 'email' ? 'you@example.com' : '10-digit number'}
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-base rounded-sm outline-none focus:border-black"
                />
                {errors.identifier && <p className="text-red-400 text-sm">{errors.identifier}</p>}
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
                  placeholder="Your password"
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-base rounded-sm outline-none focus:border-black"
                />
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>

            </div>

            <div className="text-center mt-6 space-y-3">
              <button
                type="submit"
                title="Sign In"
                disabled={loading}
                className="bg-black text-white px-12 py-3 text-sm uppercase tracking-[0.25em] rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-base text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold text-black hover:underline">
                  Register
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
