"use client";

import Footer from "@/components/Footer";
import { useContacts } from "@/lib/use-content";

export default function ContactUsPage() {
  const { contacts } = useContacts();

  return (
    <main className="inner-page">
      <section className="inner-page-container">
        <div className="section-header" style={{ padding: "0 0 1rem", textAlign: "left" }}>
          <span className="section-label">Contact Us</span>
          <h1 className="section-title">Let&apos;s Plan Your Next Journey</h1>
          <p style={{ maxWidth: "60ch", color: "var(--color-text-secondary)", marginTop: "1rem", lineHeight: 1.8 }}>
            Our team is available for property bookings, curated packages,
            corporate travel coordination, and tailored international requirements.
          </p>
        </div>

        <div className="inner-page-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          {contacts.map((card) => (
            <article key={card.id} className="inner-card">
              <h3>{card.title}</h3>
              {card.email && <p>Email: {card.email}</p>}
              {card.phone && <p>Phone: {card.phone}</p>}
              {card.address && <p>{card.address}</p>}
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
