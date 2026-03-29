"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFeatures } from "@/lib/use-content";

gsap.registerPlugin(ScrollTrigger);

export default function Showcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { features } = useFeatures();

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".showcase-card");

    const ctx = gsap.context(() => {
      // Staggered reveal of cards
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            end: "top 40%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="showcase-section">
      {/* Section Header */}
      <div className="section-header">
        <span className="section-label">What We Offer</span>
        <h2 className="section-title">
          Experiences Beyond the Ordinary
        </h2>
      </div>

      {/* Feature Grid */}
      <div ref={cardsRef} className="showcase-grid">
        {features.map((feature) => (
          <div key={feature.id} className="showcase-card" data-clickable>
            <span className="showcase-number">{feature.number}</span>
            <div
              className="showcase-icon"
              dangerouslySetInnerHTML={{ __html: feature.iconSvg || "" }}
            />
            <h3 className="showcase-card-title">{feature.title}</h3>
            <p className="showcase-card-desc">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
