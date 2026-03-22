import Image from "next/image";

export default function InfoSidebarSection({ title, items = [], note = "", image, theme }) {
  return (
    <section className={`border shadow-[0_18px_50px_rgba(45,24,16,0.08)] backdrop-blur-sm overflow-hidden ${theme.sidebarPanel}`}>
      {image ? (
        <div className="relative h-44 w-full">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
      ) : null}
      <div className="p-5">
        <h3 className={`text-lg font-semibold tracking-[0.08em] uppercase ${theme.sidebarHeading}`}>{title}</h3>
        <div className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
          {items.map((item, index) => {
            if (typeof item === "string") {
              return (
                <p key={`${title}-${index}`} className={`border-b pb-3 last:border-b-0 last:pb-0 ${theme.sidebarItemBorder}`}>
                  {item}
                </p>
              );
            }

            return (
              <div key={`${title}-${item.label}-${index}`} className={`border-b pb-3 last:border-b-0 last:pb-0 ${theme.sidebarItemBorder}`}>
                <p className={`text-xs uppercase tracking-[0.22em] ${theme.sidebarLabel}`}>{item.label}</p>
                <p className={`mt-1 text-base ${theme.sidebarValue}`}>{item.value}</p>
              </div>
            );
          })}
        </div>
        {note ? <p className="mt-4 text-sm leading-6 text-stone-600">{note}</p> : null}
      </div>
    </section>
  );
}
