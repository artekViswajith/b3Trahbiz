import Footer from "@/components/Footer";

export default function ContactUsPage() {
  return (
    <main className="inner-page">
      <section className="inner-page-container">
        <div className="section-header" style={{ padding: "0 0 1rem", textAlign: "left" }}>
          <span className="section-label">Contact Us</span>
          <h1 className="section-title">Let’s Plan Your Next Journey</h1>
          <p style={{ maxWidth: "60ch", color: "var(--color-text-secondary)", marginTop: "1rem", lineHeight: 1.8 }}>
            Our team is available for property bookings, curated packages,
            corporate travel coordination, and tailored international requirements.
          </p>
        </div>

        <div className="inner-page-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <article className="inner-card">
            <h3>General Enquiries</h3>
            <p>Email: hello@trahbiz.com</p>
            <p>Phone: +91 80 0000 0000</p>
          </article>

          <article className="inner-card">
            <h3>Corporate Desk</h3>
            <p>Email: corporate@trahbiz.com</p>
            <p>Phone: +971 4 000 0000</p>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
