"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteSettings } from "@/lib/use-content";

export default function Navbar() {
  const pathname = usePathname();
  const { navLinks, settings } = useSiteSettings();

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <Link href="/" className="site-nav-brand" data-clickable>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings.logoUrl || "/icons/trahbiz_logo.png"} alt={settings.siteName || "Trahbiz"} />
        </Link>

        <nav className="site-nav-links" aria-label="Primary">
          {navLinks
            .filter((item) => item.isActive)
            .map((item) => {
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
