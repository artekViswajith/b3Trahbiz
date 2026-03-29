"use client";

import { useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeroContent } from "@/lib/use-content";

gsap.registerPlugin(ScrollTrigger);

const EarthBackground = dynamic(() => import("@/components/EarthBackground"), {
  ssr: false,
});

interface HeroProps {
  loaded: boolean;
}

export default function Hero({ loaded }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoBgRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const btnWrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const cms = useHeroContent();

  const words = useMemo(() => cms.headline.split(" "), [cms.headline]);

  // ── Entrance animations when loader completes ──
  useEffect(() => {
    if (!loaded) return;

    const wordSpans = contentRef.current?.querySelectorAll(".word-mask span");
    const subtitles = contentRef.current?.querySelectorAll(".hero-subtitle");
    const ctaWrap = btnWrapRef.current;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (wordSpans) {
      tl.to(wordSpans, {
        y: 0,
        duration: 1,
        stagger: 0.1,
      });
    }

    if (subtitles && subtitles.length > 0) {
      tl.to(
        subtitles,
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      );
    }

    if (ctaWrap) {
      tl.to(
        ctaWrap,
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      );
    }

    return () => {
      tl.kill();
    };
  }, [loaded]);

  // ── 3-layer Parallax ──
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Background video - moves slowest
      gsap.to(videoBgRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Midground mist - moves at medium speed
      gsap.to(mistRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // Foreground content - moves fastest (natural scroll)
      gsap.to(contentRef.current, {
        yPercent: -10,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Particle animation ──
  useEffect(() => {
    if (!particlesRef.current) return;

    const particles = particlesRef.current.children;
    Array.from(particles).forEach((p) => {
      const el = p as HTMLElement;
      gsap.set(el, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random() * 0.5 + 0.2,
      });

      gsap.to(el, {
        y: `-=${200 + Math.random() * 300}`,
        x: `+=${(Math.random() - 0.5) * 100}`,
        opacity: 0,
        duration: 4 + Math.random() * 6,
        repeat: -1,
        delay: Math.random() * 4,
        ease: "none",
      });
    });
  }, []);

  // ── Magnetic button ──
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 150;

      if (dist < maxDist) {
        const strength = 1 - dist / maxDist;
        gsap.to(btn, {
          x: dx * strength * 0.35,
          y: dy * strength * 0.35,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    btn.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      btn.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-section">
      {/* Layer 1: Background Video */}
      <div ref={videoBgRef} className="hero-video-bg">
        <div className="video-fallback" />
        <EarthBackground />
      </div>

      {/* Layer 2: Mist / atmosphere */}
      <div ref={mistRef} className="hero-mist" />

      {/* Floating particles */}
      <div ref={particlesRef} className="hero-particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <div className="hero-contrast-overlay" />

      {/* Layer 3: Content (Foreground) */}
      <div ref={contentRef} className="hero-content">
        <p
          className="hero-subtitle mb-6"
          style={{
            fontSize: "1rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(248, 113, 113, 0.98)",
            textShadow: "0 1px 10px rgba(0, 0, 0, 0.45)",
          }}
        >
          {cms.kicker}
        </p>

        <h1
          className="mb-8"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 6rem)",
            fontWeight: 200,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "rgba(248, 250, 252, 0.98)",
            textShadow: "0 10px 30px rgba(0, 0, 0, 0.42), 0 2px 10px rgba(0, 0, 0, 0.55)",
          }}
        >
          {words.map((word, i) => (
            <span className="word-mask" key={i}>
              <span>{word}</span>
            </span>
          ))}
        </h1>

        <p
          className="hero-subtitle mb-10 mx-auto"
          style={{
            maxWidth: "36rem",
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "rgba(241, 245, 249, 0.9)",
            textShadow: "0 2px 12px rgba(0, 0, 0, 0.45)",
          }}
        >
          {cms.subtitle}
        </p>

        <div ref={btnWrapRef} className="hero-cta-wrap">
          <button ref={btnRef} className="magnetic-btn" data-clickable>
            {cms.ctaText}
          </button>
        </div>
      </div>
    </section>
  );
}
