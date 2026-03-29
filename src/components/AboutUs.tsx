"use client";

import { useAboutContent } from "@/lib/use-content";

export default function AboutUs() {
  const cms = useAboutContent();

  return (
    <section className="about-section" id="about-us">
      <div className="about-container">
        <div>
          <span className="about-kicker">{cms.kicker}</span>
          <h2 className="about-title">
            {cms.title}
          </h2>
          <p className="about-lead">
            {cms.leadText}
          </p>
        </div>

        <div className="about-content">
          <h3 className="about-subheading">{cms.subheading1}</h3>
          <p className="about-paragraph">
            {cms.paragraph1}
          </p>
          <p className="about-paragraph" style={{ marginTop: "0.9rem" }}>
            {cms.paragraph2}
          </p>

          <h3 className="about-subheading">
            {cms.subheading2}
          </h3>
          <p className="about-paragraph">
            {cms.paragraph3}
          </p>

          <ul className="about-list">
            {cms.listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <p className="about-paragraph" style={{ marginTop: "0.8rem" }}>
            {cms.closingText}
          </p>
        </div>
      </div>
    </section>
  );
}
