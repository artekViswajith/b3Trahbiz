"use client";

import Footer from "@/components/Footer";
import { useProperties } from "@/lib/use-content";

export default function OurPropertiesPage() {
  const { properties } = useProperties();

  return (
    <main className="inner-page">
      <section className="inner-page-container">
        <div className="section-header" style={{ padding: "0 0 1rem", textAlign: "left" }}>
          <span className="section-label">Our Properties</span>
          <h1 className="section-title">Global Destinations, Signature Stays</h1>
          <p style={{ maxWidth: "60ch", color: "var(--color-text-secondary)", marginTop: "1rem", lineHeight: 1.8 }}>
            Discover Trahbiz properties across key international destinations, each curated
            with our standards of precision, comfort, and elevated guest experiences.
          </p>
        </div>

        <div className="inner-page-grid">
          {properties.map((property) => (
            <article key={property.id} className="inner-card" data-clickable>
              <h3>{property.name}</h3>
              <p style={{ color: "var(--color-red)", fontSize: "0.74rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.55rem" }}>
                {property.location}
              </p>
              <p>{property.details}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
