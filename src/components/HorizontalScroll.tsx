"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const SERVICES: Service[] = [
  {
    id: "svc_01",
    number: "01",
    title: "Luxury Stays",
    subtitle: "Palace Hotels & Boutique Resorts",
    description:
      "Hand-picked heritage estates and world-class resorts — from overwater villas in the Maldives to alpine lodges in Switzerland.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  },
  {
    id: "svc_02",
    number: "02",
    title: "Corporate Travel",
    subtitle: "Seamless Business Journeys",
    description:
      "End-to-end corporate travel management with VIP airport transfers, curated team offsites, and incentive travel experiences.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  },
  {
    id: "svc_03",
    number: "03",
    title: "Guided Tours",
    subtitle: "Expert-Led Cultural Immersions",
    description:
      "Walk through history with specialist guides — from Renaissance districts in Europe to sacred temples in Southeast Asia and medinas in North Africa.",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
  },
  {
    id: "svc_04",
    number: "04",
    title: "Wildlife Safaris",
    subtitle: "Into the Wild Corners of the World",
    description:
      "Track big cats on African game drives, encounter polar wildlife in the Arctic, or cruise through Amazon rainforests — all with expert naturalists.",
    image:
      "https://images.unsplash.com/photo-1615824996195-f780bba7cfab?w=600&q=80",
  },
  {
    id: "svc_05",
    number: "05",
    title: "Culinary Experiences",
    subtitle: "A Feast for Every Sense",
    description:
      "Private dining with world-class chefs, market walks through global food capitals, and estate tastings — experience authentic flavors worldwide.",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const cards = track.querySelectorAll(".service-card");
    const getTotalWidth = () => Math.max(track.scrollWidth - window.innerWidth, 0);

    const ctx = gsap.context(() => {
      // Set section height to allow for horizontal scroll
      gsap.set(sectionRef.current, {
        height: () => getTotalWidth() + window.innerHeight,
      });

      // Pin and translate the track horizontally
      gsap.to(track, {
        x: () => -getTotalWidth(),
        ease: "none",
        id: "hscroll",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getTotalWidth()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Stagger card entrance
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0.3, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: gsap.getById?.("hscroll") || undefined,
              start: "left 80%",
              end: "left 50%",
              scrub: 1,
              // Use section's scroll progress
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    // Refresh ScrollTrigger on resize
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    // Ensure initial measurements include final rendered card widths
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={sectionRef} className="horizontal-section">
      {/* Section Header — sits above the pinned scroll */}
      <div className="section-header" style={{ position: "relative", zIndex: 2 }}>
        <span className="section-label">What We Do</span>
        <h2 className="section-title">
          Crafting Unforgettable Experiences
        </h2>
      </div>

      {/* Horizontal Track */}
      <div
        ref={trackRef}
        className="horizontal-track"
        style={{ paddingTop: "2rem" }}
      >
        {SERVICES.map((service) => (
          <article key={service.id} className="service-card" data-clickable>
            <span className="service-card-number">{service.number}</span>

            <div className="service-card-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
              />
            </div>

            <div className="service-card-overlay">
              <h3
                className="text-xl font-light mb-1"
                style={{ color: "var(--color-text)" }}
              >
                {service.title}
              </h3>

              <div className="service-card-text">
                <p
                  className="text-xs tracking-wider uppercase mb-2"
                  style={{ color: "var(--color-red)" }}
                >
                  {service.subtitle}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
