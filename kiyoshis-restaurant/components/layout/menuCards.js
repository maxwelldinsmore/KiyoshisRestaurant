import Image from "next/image";

export default function MenuHighlightCard({ item }) {
  return (
    <article className="flex h-full flex-col overflow-hidden border border-[#c7d3e0] bg-white shadow-[0_12px_24px_rgba(18,38,63,0.08)]">
      <div className="relative h-44 w-full">
        <Image src={item.image} alt={`${item.name} food item`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#102841]">{item.name}</h3>
          <span className="shrink-0 border border-[#c7d3e0] bg-[#edf3f8] px-3 py-1 text-sm font-semibold text-[#102841]">{item.price}</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#4f657d]">{item.description}</p>
        <div className="mt-auto flex justify-center pt-3">
          <button
            type="button"
            aria-label={`Add ${item.name} to cart`}
            className="border border-[#b21f2d] bg-[#b21f2d] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#971926]">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
