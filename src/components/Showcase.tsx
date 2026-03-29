"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FEATURES: ShowcaseItem[] = [
  {
    id: "feat_01",
    number: "01",
    title: "Heritage Circuits",
    description:
      "Meticulously curated routes through UNESCO heritage sites across continents — from medieval citadels to imperial masterpieces.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="22" width="32" height="20" rx="1" />
        <path d="M14 22V14a10 10 0 0 1 20 0v8" />
        <line x1="24" y1="8" x2="24" y2="4" />
        <circle cx="24" cy="4" r="1.5" />
        <line x1="14" y1="42" x2="14" y2="22" />
        <line x1="24" y1="42" x2="24" y2="22" />
        <line x1="34" y1="42" x2="34" y2="22" />
      </svg>
    ),
  },
  {
    id: "feat_02",
    number: "02",
    title: "Luxury Concierge",
    description:
      "24/7 dedicated travel concierge with private airport transfers, bespoke dining reservations, and VIP access.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="18" r="8" />
        <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" />
        <path d="M20 18l2 2 6-6" />
      </svg>
    ),
  },
  {
    id: "feat_03",
    number: "03",
    title: "Wildlife Expeditions",
    description:
      "Expert-led expeditions across iconic reserves worldwide — from African savannas to South American wetlands and Arctic frontiers.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 36c0-6 4-10 12-10s12 4 12 10" />
        <ellipse cx="24" cy="20" rx="8" ry="6" />
        <circle cx="20" cy="18" r="1" />
        <circle cx="28" cy="18" r="1" />
        <path d="M8 24l-4-6" />
        <path d="M40 24l4-6" />
      </svg>
    ),
  },
  {
    id: "feat_04",
    number: "04",
    title: "Culinary Journeys",
    description:
      "Private dining with royal chefs, spice trail walks, and street food crawls curated by local gastronomes.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v16" />
        <path d="M8 4v8a4 4 0 0 0 8 0V4" />
        <line x1="12" y1="20" x2="12" y2="44" />
        <path d="M36 4c0 0-4 4-4 12h8c0-8-4-12-4-12z" />
        <line x1="36" y1="16" x2="36" y2="44" />
      </svg>
    ),
  },
  {
    id: "feat_05",
    number: "05",
    title: "Corporate Retreats",
    description:
      "End-to-end team offsite planning — destination venues, adventure team-building, and seamless logistics.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="10" width="36" height="28" rx="2" />
        <line x1="6" y1="18" x2="42" y2="18" />
        <line x1="18" y1="18" x2="18" y2="38" />
        <rect x="10" y="22" width="4" height="4" rx="0.5" />
        <rect x="22" y="22" width="16" height="4" rx="0.5" />
        <rect x="22" y="30" width="10" height="4" rx="0.5" />
      </svg>
    ),
  },
  {
    id: "feat_06",
    number: "06",
    title: "Wellness & Ayurveda",
    description:
      "Holistic wellness retreats across premier destinations — restorative therapies, yoga, and mindful renewal.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 44V24" />
        <path d="M24 24c-8-2-14-10-14-18 8 2 14 10 14 18z" />
        <path d="M24 24c8-2 14-10 14-18-8 2-14 10-14 18z" />
        <path d="M18 40c0-3.314 2.686-6 6-6s6 2.686 6 6" />
      </svg>
    ),
  },
];

export default function Showcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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
        {FEATURES.map((feature) => (
          <div key={feature.id} className="showcase-card" data-clickable>
            <span className="showcase-number">{feature.number}</span>
            <div className="showcase-icon">{feature.icon}</div>
            <h3 className="showcase-card-title">{feature.title}</h3>
            <p className="showcase-card-desc">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
