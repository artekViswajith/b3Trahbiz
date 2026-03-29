"use client";

import { useSiteSettings } from "@/lib/use-content";

export default function Footer() {
  const { settings, socialLinks, footer } = useSiteSettings();

  return (
    <footer className="site-footer">
      <div className="mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={settings.logoUrl || "/icons/trahbiz_logo.png"}
          alt={settings.siteName || "Trahbiz"}
          className="footer-logo"
          style={{ margin: "0 auto" }}
        />
      </div>
      <p
        className="mb-4"
        style={{
          fontSize: "0.8rem",
          color: "var(--color-text-muted)",
          letterSpacing: "0.05em",
        }}
      >
        {footer.tagline}
      </p>
      <div
        className="flex justify-center gap-8 mb-6"
        style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
      >
        {socialLinks
          .filter((s) => s.isActive)
          .map((link) => (
            <a
              key={link.label}
              href={link.url}
              data-clickable
              className="transition-colors duration-300"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-red)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              {link.label}
            </a>
          ))}
      </div>
      <p style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", opacity: 0.5 }}>
        © {new Date().getFullYear()} {footer.copyright}
      </p>
    </footer>
  );
}
