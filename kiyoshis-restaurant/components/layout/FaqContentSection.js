import Image from "next/image";

export default function InfoMainSection({ title, paragraphs = [], list = [], items = [], table = null, image, theme }) {
  return (
    <section className={`border p-6 shadow-[0_24px_60px_rgba(58,35,25,0.08)] backdrop-blur-sm sm:p-8 ${theme.mainPanel}`}>
      <h2 className={`text-2xl font-semibold tracking-tight sm:text-3xl ${theme.sectionHeading}`}>{title}</h2>
      <div className="mt-5 space-y-4 text-base leading-8 text-stone-700">
        {paragraphs.map((paragraph, index) => (
          <p key={`${title}-paragraph-${index}`}>{paragraph}</p>
        ))}
      </div>
      {image ? (
        <div className={`mt-6 overflow-hidden rounded border ${theme.listBorder}`}>
          <Image src={image} alt={title} width={800} height={450} className="w-full object-cover" />
        </div>
      ) : table?.columns?.length && table?.rows?.length ? (
        <div className={`mt-6 overflow-x-auto border-t pt-5 ${theme.listBorder}`}>
          <table className="min-w-full border border-[#d4deea] bg-white text-sm sm:text-base">
            <thead className="bg-[#f2f7fd] text-left text-xs uppercase tracking-[0.12em] text-[#1f4266] sm:text-sm">
              <tr>
                {table.columns.map((column) => (
                  <th key={`${title}-${column}`} className="border-b border-[#d4deea] px-4 py-3 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, rowIndex) => (
                <tr key={`${title}-row-${rowIndex}`} className="align-top">
                  {row.map((cell, cellIndex) => (
                    <td key={`${title}-row-${rowIndex}-cell-${cellIndex}`} className="border-b border-[#e4ebf3] px-4 py-3 text-stone-700 last:border-r-0">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : items.length ? (
        <div className={`mt-6 border-t pt-5 ${theme.listBorder}`}>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={`${title}-item-${index}`} className="border-b pb-4 last:border-b-0 last:pb-0">
                <p className={`text-sm font-semibold uppercase tracking-[0.08em] ${theme.sidebarLabel}`}>{item.label}</p>
                <p className={`mt-2 text-base ${theme.sidebarValue}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      ) : list.length ? (
        <ul className={`mt-6 space-y-3 border-t pt-5 text-sm leading-7 text-stone-700 sm:text-base ${theme.listBorder}`}>
          {list.map((item, index) => (
            <li key={`${title}-list-${index}`} className="flex gap-3">
              <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${theme.listDot}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
