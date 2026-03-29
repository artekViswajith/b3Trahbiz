"use client";

import Footer from "@/components/Footer";
import { usePackages } from "@/lib/use-content";

export default function OurPackagesPage() {
  const { packages } = usePackages();

  return (
    <main className="inner-page">
      <section className="inner-page-container">
        <div className="section-header" style={{ padding: "0 0 1rem", textAlign: "left" }}>
          <span className="section-label">Our Packages</span>
          <h1 className="section-title">Tailored Packages for Every Journey</h1>
          <p style={{ maxWidth: "60ch", color: "var(--color-text-secondary)", marginTop: "1rem", lineHeight: 1.8 }}>
            From business mobility to luxury getaways, our package ecosystem is
            built to deliver reliable, premium travel solutions globally.
          </p>
        </div>

        <div className="inner-page-grid">
          {packages.map((pkg) => (
            <article key={pkg.id} className="inner-card" data-clickable>
              <h3>{pkg.title}</h3>
              <p>{pkg.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
