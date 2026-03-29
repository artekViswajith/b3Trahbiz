"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/our-properties", label: "Our Properties" },
  { href: "/our-packages", label: "Our Packages" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <Link href="/" className="site-nav-brand" data-clickable>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/trahbiz_logo.png" alt="Trahbiz" />
        </Link>

        <nav className="site-nav-links" aria-label="Primary">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                data-clickable
                className={`site-nav-link${isActive ? " active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
