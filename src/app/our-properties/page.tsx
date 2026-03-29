import Footer from "@/components/Footer";

const PROPERTIES = [
  {
    name: "Trahbiz Signature Hotel",
    location: "Bengaluru, India",
    details:
      "Our flagship property blending contemporary luxury with business-ready infrastructure and personalized concierge service.",
  },
  {
    name: "Trahbiz City Residences",
    location: "Dubai, UAE",
    details:
      "Premium serviced residences for extended stays, executive travel, and high-comfort city living.",
  },
  {
    name: "Trahbiz Seaside Retreat",
    location: "Bali, Indonesia",
    details:
      "A leisure-focused coastal property curated for wellness escapes, private events, and destination celebrations.",
  },
  {
    name: "Trahbiz Alpine Lodge",
    location: "Interlaken, Switzerland",
    details:
      "Boutique mountain hospitality designed for luxury leisure and team retreats in scenic alpine surroundings.",
  },
  {
    name: "Trahbiz Heritage Residence",
    location: "Lisbon, Portugal",
    details:
      "A restored heritage address offering immersive local experiences with modern hospitality standards.",
  },
  {
    name: "Trahbiz Waterfront Suites",
    location: "Singapore",
    details:
      "Strategic urban waterfront accommodation with seamless access for corporate and premium family travel.",
  },
];

export default function OurPropertiesPage() {
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
          {PROPERTIES.map((property) => (
            <article key={property.name} className="inner-card" data-clickable>
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
