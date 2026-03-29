"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useServices } from "@/lib/use-content";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { services } = useServices();

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
        {services.map((service) => (
          <article key={service.id} className="service-card" data-clickable>
            <span className="service-card-number">{service.number}</span>

            <div className="service-card-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.imageUrl}
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
