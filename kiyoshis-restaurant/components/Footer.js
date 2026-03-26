/**
 * File: Footer.js
 * Authors: All of us
 * Last Edited: 2026-03-04
 * Description: This is our footer
 */

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-[#1b4578]/40 bg-[#0a1628] text-neutral-100" aria-label="Site footer">
            <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-1 px-4 py-2 sm:px-6 lg:px-8">
                <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/" className="flex h-20 items-center sm:h-24" aria-label="Go to homepage" title="Home">
                        <img src="/KiyoshiLogo3.png" alt="Kiyoshi Restaurant Logo" className="h-full w-auto" />
                    </Link>

                    <nav className="ml-auto flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-right text-sm text-neutral-300" aria-label="Footer navigation">
                        <Link href="/contactUs" className="transition-colors hover:text-white" aria-label="Go to Contact Us page" title="Contact Us">
                            Contact Us
                        </Link>
                        <Link href="/faq" className="transition-colors hover:text-white" aria-label="Go to Frequently Asked Questions page" title="Frequently Asked Questions">
                            FAQ
                        </Link>
                        <Link href="/terms" className="transition-colors hover:text-white" aria-label="Go to Terms and Conditions page" title="Terms and Conditions">
                            Terms &amp; Conditions
                        </Link>
                        <Link href="/privacy" className="transition-colors hover:text-white" aria-label="Go to Privacy Policy page" title="Privacy Policy">
                            Privacy Policy
                        </Link>
                    </nav>
                </div>

                <p className="text-center text-xs tracking-wide text-neutral-400" aria-label="Copyright information">
                    Copyright 2026 Kiyoshi.
                </p>
            </div>
        </footer>
    );
}