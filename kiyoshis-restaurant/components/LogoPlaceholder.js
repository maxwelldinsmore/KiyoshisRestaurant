export default function LogoPlaceholder({ small = false }) {
  return (
    <div
      className={`${small ? "w-8 h-8 text-[9px]" : "w-12 h-12 text-xs"} bg-gray-200 border border-gray-400 flex items-center justify-center font-semibold text-gray-500 rounded-sm shrink-0`}
    >
      LOGO
    </div>
  );
}
