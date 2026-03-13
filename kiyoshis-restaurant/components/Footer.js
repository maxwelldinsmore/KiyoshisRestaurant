import Link from "next/link";
import LogoPlaceholder from "./LogoPlaceholder";

const footerLinks = [
  { label: "Terms &\nConditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Contact", href: "/#find-us" },
  { label: "About Us", href: "/" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-x-8 gap-y-6 justify-between items-start">
        <div className="flex items-start gap-3">
          <LogoPlaceholder small />
          <div>
            <p className="text-base font-bold leading-tight">
              Sushi Bai
              <br />
              Kiyoshi
            </p>
            <p className="text-xs text-gray-400 mt-1 tracking-wide">©2026 BytexSolutions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-white rounded-full flex items-center justify-center text-base font-bold flex-shrink-0">
            ?
          </div>
          <span className="text-xs text-gray-300 leading-relaxed tracking-wide">
            Frequently Asked
            <br />
            Questions
          </span>
        </div>

        {footerLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-xs text-gray-300 hover:text-white whitespace-pre-line leading-relaxed tracking-wide transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}