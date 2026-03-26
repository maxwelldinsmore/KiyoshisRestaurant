import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const rewards = [
  { title: "15% Discount", pointsRequired: 10 },
  { title: "Free Single Server", pointsRequired: 20 },
  { title: "Free Single Server+", pointsRequired: 30 },
  { title: "50% Discount", pointsRequired: 40 },
];

const CURRENT_POINTS = 4;
const MAX_POINTS = 40;

function RewardCard({ title, pointsRequired }) {
  const unlocked = CURRENT_POINTS >= pointsRequired;
  return (
    <div className={`border p-4 ${unlocked ? "border-[#b21f2d] bg-white" : "border-[#35516e] bg-[#17324f]"}`} aria-label={`Reward: ${title}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.1em] ${unlocked ? "text-[#102841]" : "text-[#a8bfd6]"}`}>
        {pointsRequired} pts
      </p>
      <p className={`mt-1 text-sm font-semibold ${unlocked ? "text-[#102841]" : "text-white"}`}>{title}</p>
      <div
        className={`mt-3 flex h-20 items-center justify-center text-xs font-semibold uppercase tracking-wide ${
          unlocked ? "bg-[#fdf3f4] text-[#b21f2d]" : "bg-[#1e3f5e] text-[#7a9ab5]"
        }`}
      >
        {unlocked ? "✓ Unlocked" : "Locked"}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [promotions, setPromotions] = useState({ email: true, sms: true });
  const [showPassword, setShowPassword] = useState(false);
  const [showPwFields, setShowPwFields] = useState({ current: false, next: false, confirm: false });
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/user", { credentials: "include", signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) { setUser(null); return; }
        const data = await res.json().catch(() => ({}));
        const u = data?.user ?? null;
        setUser(u);
        if (u) {
          setForm({
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            email: u.email || "",
            phone: u.phoneNumber || "",
          });
        }
      })
      .catch((err) => { if (err.name !== "AbortError") setUser(null); });
    return () => controller.abort();
  }, []);

  const displayName = useMemo(() => user?.firstName || "there", [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    
    // Check password field status
    const pwFieldsFilled = {
      current: !!pwForm.current,
      next: !!pwForm.next,
      confirm: !!pwForm.confirm,
    };
    const anyPwFieldFilled = Object.values(pwFieldsFilled).some(v => v);
    const allPwFieldsFilled = Object.values(pwFieldsFilled).every(v => v);
    const onlyCurrentFilled = pwFieldsFilled.current && !pwFieldsFilled.next && !pwFieldsFilled.confirm;
    
    // Validate password logic
    if (anyPwFieldFilled && !allPwFieldsFilled && !onlyCurrentFilled) {
      setPwErrors({ _: "Please fill in all password fields or leave them empty to skip password change." });
      return;
    }
    
    try {
      // Update profile
      const profileResponse = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer_id: user?.id,
          customer_first_name: form.firstName,
          customer_last_name: form.lastName,
          customer_email: form.email,
          customer_phonenumber: form.phone,
          promo_opt_in: promotions.email || promotions.sms,
          contact_method: promotions.email && promotions.sms ? "both" : promotions.email ? "email" : promotions.sms ? "sms" : "none",
        }),
      });

      if (!profileResponse.ok) {
        const err = await profileResponse.json();
        throw new Error(err.error || "Failed to update profile");
      }

      // Update password if all fields are filled
      if (allPwFieldsFilled) {
        const pwResponse = await fetch("/api/auth/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: pwForm.current,
            newPassword: pwForm.next,
          }),
        });

        if (!pwResponse.ok) {
          const err = await pwResponse.json();
          throw new Error(err.error || "Failed to update password");
        }

        setPwForm({ current: "", next: "", confirm: "" });
        setShowPwFields({ current: false, next: false, confirm: false });
        setPwErrors({});
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Save error:", err);
    }
  };

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm((prev) => ({ ...prev, [name]: value }));
    setPwErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePromoToggle = (type) => {
    setPromotions((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const progressPct = Math.min((CURRENT_POINTS / MAX_POINTS) * 100, 100);

  return (
    <div className="flex min-h-dvh flex-col bg-[#edf3f8]">
      <Head>
        <title>Account | Sushi Bai Kiyoshi</title>
      </Head>

      <Header active="account" userName={user?.firstName || ""} />

      <main className="flex-1">
        {/* Profile section */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5a728c]">Manage Account</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#102841] md:text-5xl">Account</h1>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#5a728c]">
            Welcome Back, {displayName}! Update, Change & manage your Profile.
          </p>

          {/* Unified settings card */}
          <form onSubmit={handleSave} noValidate className="mt-8 border border-[#c7d3e0] bg-white shadow-sm p-6 md:p-10">
            {/* Profile section */}
            <div className="px-0 py-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5a728c]">Profile Details</p>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {[
                  { label: "First Name", name: "firstName", placeholder: "First name" },
                  { label: "Last Name", name: "lastName", placeholder: "Last name" },
                  { label: "Email", name: "email", placeholder: "you@example.com", type: "email" },
                  { label: "Phone Number", name: "phone", placeholder: "10-digit number", type: "tel" },
                ].map(({ label, name, placeholder, type = "text" }) => (
                  <div key={name} className="space-y-2">
                    <label htmlFor={name} className="block text-lg font-semibold text-[#102841] md:text-xl">
                      {label}
                    </label>
                    <input
                      id={name}
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      aria-label={label}
                      className="w-full border border-[#c7d3e0] bg-white px-4 py-3 text-base text-[#102841] outline-none focus:border-[#102841]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#e2eaf2]" />

            {/* Password collapsible section */}
            <div className="py-10">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex w-full items-center justify-between rounded p-0 text-left hover:opacity-75"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5a728c]">Change Password</p>

                </div>
                <svg className={`h-5 w-5 transition-transform text-[#5a728c] ${showPassword ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showPassword && (
                <div className="mt-7">
                  {pwErrors._ && (
                    <div className="mb-5 rounded bg-[#fdf3f4] p-3 text-sm text-[#b21f2d]">
                      {pwErrors._}
                    </div>
                  )}
                  <div className="space-y-6">
                    {[
                      { label: "Current Password", name: "current", placeholder: "Enter current password", hint: "Required to verify your identity" },
                      { label: "New Password", name: "next", placeholder: "Create new password", hint: "Minimum 8 characters recommended" },
                      { label: "Confirm Password", name: "confirm", placeholder: "Repeat new password", hint: "Must match new password" },
                    ].map(({ label, name, placeholder, hint }) => (
                      <div key={name} className="space-y-2">
                        <label htmlFor={`pw-${name}`} className="block text-sm font-semibold text-[#102841]">
                          {label}
                        </label>
                        <p className="text-xs text-[#7a9ab5]">{hint}</p>
                        <div className="relative mt-2">
                          <input
                            id={`pw-${name}`}
                            type={showPwFields[name] ? "text" : "password"}
                            name={name}
                            value={pwForm[name]}
                            onChange={handlePwChange}
                            placeholder={placeholder}
                            aria-label={label}
                            className="w-full border border-[#c7d3e0] bg-white px-4 py-3 pr-12 text-base text-[#102841] outline-none focus:border-[#102841]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPwFields((prev) => ({ ...prev, [name]: !prev[name] }))}
                            aria-label={showPwFields[name] ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a728c] hover:text-[#102841] transition-colors"
                          >
                            {showPwFields[name] ? (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 1.657-.895 3.253-2.236 4.053M9 19.5A9.964 9.964 0 0112 20c4.478 0 8.268-2.943 9.543-7a10.025 10.025 0 00-4.132-5.411M9 19.5L4.575 15.15" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        {pwErrors[name] && <p className="mt-1 text-sm text-[#b21f2d]">{pwErrors[name]}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#e2eaf2]" />

            {/* Communication preferences section */}
            <div className="py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5a728c]">Communication Preferences</p>
              <div className="mt-5 space-y-4">
                {[
                  { type: "email", label: "Promotional Emails", desc: "Receive special offers and seasonal deals." },
                  { type: "sms", label: "Text Messages", desc: "Get loyalty updates and flash deals via SMS." },
                ].map(({ type, label, desc }) => (
                  <div key={type} className="flex items-center justify-between gap-6">
                    <div>
                      <p className="text-base font-semibold text-[#102841]">{label}</p>
                      <p className="mt-1 text-sm text-[#5a728c]">{desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePromoToggle(type)}
                      aria-pressed={promotions[type]}
                      aria-label={`Toggle ${label}`}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus:outline-none ${
                        promotions[type] ? "border-[#102841] bg-[#102841]" : "border-[#c7d3e0] bg-[#c7d3e0]"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          promotions[type] ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Single save button at the end */}
            <div className="border-t border-[#e2eaf2]" />
            <div className="py-8 text-center">
              <button
                type="submit"
                className="bg-[#102841] px-12 py-3 text-sm uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#1a3a5e]"
              >
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        {/* Loyalty section */}
        <section className="border-y border-[#35516e] bg-[#102841]">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a8bfd6]">Loyalty Program</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Earn Points, Unlock Rewards
            </h2>
            <p className="mt-2 text-sm text-[#a8bfd6] sm:text-base">Earn points after every eligible purchase.</p>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#a8bfd6]">Your Points</span>
                <span className="text-sm font-semibold text-white">{CURRENT_POINTS} / {MAX_POINTS}</span>
              </div>
              <div className="mb-1 flex justify-between text-xs text-[#7a9ab5]">
                {[0, 10, 20, 30, 40].map((n) => <span key={n}>{n}</span>)}
              </div>
              <div className="relative h-2 bg-[#1e3f5e]">
                <div className="absolute left-0 top-0 h-2 bg-[#b21f2d] transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {rewards.map((reward) => (
                <RewardCard key={reward.title} title={reward.title} pointsRequired={reward.pointsRequired} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
