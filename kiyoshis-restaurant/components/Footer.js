/**
 * File: Footer.js
 * Authors: All of us
 * Last Edited: 2026-03-04
 * Description: This is our footer
 */

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-neutral-700 bg-black text-neutral-100">
            <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-3 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex h-20 items-center sm:h-24">
                        <img src="/KiyoshiLogo3.png" alt="Kiyoshi Logo" className="h-full w-auto" />
                    </div>

                    <nav className="ml-auto flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-right text-sm text-neutral-300">
                        <Link href="/contactUs" className="transition-colors hover:text-white">
                            Contact Us
                        </Link>
                        <Link href="/faq" className="transition-colors hover:text-white">
                            Frequently Asked Questions
                        </Link>
                        <Link href="/licenses" className="transition-colors hover:text-white">
                            Licences
                        </Link>
                        <Link href="/terms" className="transition-colors hover:text-white">
                            Terms &amp; Conditions
                        </Link>
                        <Link href="/privacy" className="transition-colors hover:text-white">
                            Privacy Policy
                        </Link>
                    </nav>
                </div>

                <p className="pt-2 text-center text-xs tracking-wide text-neutral-400">
                    Copyright 2026 Kiyoshi.
                </p>
            </div>
        </footer>
    );
}