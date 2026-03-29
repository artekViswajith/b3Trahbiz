"use client";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/trahbiz_logo.png"
          alt="Trahbiz"
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
        Redefining Global Hospitality — Curated Journeys Since 2024
      </p>
      <div
        className="flex justify-center gap-8 mb-6"
        style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
      >
        <a
          href="#"
          data-clickable
          className="transition-colors duration-300"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-red)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          Instagram
        </a>
        <a
          href="#"
          data-clickable
          className="transition-colors duration-300"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-red)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          LinkedIn
        </a>
        <a
          href="#"
          data-clickable
          className="transition-colors duration-300"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-red)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          Contact
        </a>
      </div>
      <p style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", opacity: 0.5 }}>
        © {new Date().getFullYear()} Trahbiz. All rights reserved.
      </p>
    </footer>
  );
}
