export default function InfoFaqSection({ items = [], theme }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className={`border p-6 shadow-[0_24px_60px_rgba(58,35,25,0.08)] sm:p-8 ${theme.faqPanel}`}>
      <div className="flex items-center gap-4">
        <div className={`h-px flex-1 ${theme.mainLine}`} />
        <span className={`text-xs uppercase tracking-[0.32em] ${theme.mainLabel}`}>Questions</span>
      </div>
      <h2 className={`mt-4 text-2xl font-semibold tracking-tight sm:text-3xl ${theme.sectionHeading}`}>Frequently Asked Questions</h2>
      <div className="mt-6 space-y-4">
        {items.map((item, index) => (
          <details key={`${item.question}-${index}`} className={`group border p-5 ${theme.faqItem}`}>
            <summary className={`cursor-pointer list-none pr-8 text-lg font-semibold marker:hidden ${theme.sectionHeading}`}>
              {item.question}
            </summary>
            <p className="mt-3 text-base leading-7 text-stone-700">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
