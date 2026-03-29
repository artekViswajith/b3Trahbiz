import Footer from "@/components/Footer";

const PACKAGES = [
  {
    title: "Executive Mobility",
    summary:
      "End-to-end corporate travel planning with managed itineraries, airport assistance, and priority support.",
  },
  {
    title: "Luxury Leisure Collection",
    summary:
      "Premium leisure journeys with curated stays, private transfers, and destination-specific experiences.",
  },
  {
    title: "Destination Celebrations",
    summary:
      "Seamless planning for weddings, milestone events, and family gatherings in iconic locations worldwide.",
  },
  {
    title: "Adventure & Nature Expeditions",
    summary:
      "Guided immersive adventures including wildlife, mountain, and marine exploration experiences.",
  },
  {
    title: "Wellness Rebalance Journeys",
    summary:
      "Holistic travel programs focused on recovery, mindfulness, and high-comfort rejuvenation.",
  },
  {
    title: "Custom Global Itineraries",
    summary:
      "Fully bespoke packages designed around personal preferences, pace, and regional interests.",
  },
];

export default function OurPackagesPage() {
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
          {PACKAGES.map((pkg) => (
            <article key={pkg.title} className="inner-card" data-clickable>
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
