"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const compassRef = useRef<SVGSVGElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [, setPhase] = useState<"drawing" | "morphing" | "done">("drawing");

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setPhase("done");
        // Fade out the entire loader
        gsap.to(screenRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            if (screenRef.current) screenRef.current.style.display = "none";
            onComplete();
          },
        });
      },
    });

    // Get all compass paths
    const compassPaths = compassRef.current?.querySelectorAll("path");
    if (compassPaths) {
      compassPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      // Phase 1: Draw the compass
      tl.to(compassPaths, {
        strokeDashoffset: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.inOut",
      });
    }

    gsap.set(logoRef.current, { opacity: 0, scale: 1.08 });

    // Phase 2: Fade out compass, reveal text
    tl.to(
      compassRef.current,
      {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: "power2.in",
      },
      "+=0.3"
    );

    setPhase("morphing");

    tl.to(
      logoRef.current,
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    );

    // Hold the text briefly
    tl.to({}, { duration: 0.2 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={screenRef} className="loader-screen">
      {/* Compass-inspired emblem SVG */}
      <svg
        ref={compassRef}
        className="loader-svg"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <path d="M100,10 a90,90 0 1,1 -0.1,0" />
        {/* Inner circle */}
        <path d="M100,30 a70,70 0 1,1 -0.1,0" />
        {/* N-S line */}
        <path d="M100,10 L100,190" />
        {/* E-W line */}
        <path d="M10,100 L190,100" />
        {/* Diamond / compass rose */}
        <path d="M100,40 L120,100 L100,160 L80,100 Z" />
        {/* Decorative arcs */}
        <path d="M60,40 Q100,20 140,40" />
        <path d="M60,160 Q100,180 140,160" />
        {/* Small dome / lotus hint */}
        <path d="M85,65 Q100,45 115,65" />
        <path d="M90,70 Q100,55 110,70" />
        {/* Tick marks */}
        <path d="M100,10 L100,18" />
        <path d="M100,182 L100,190" />
        <path d="M10,100 L18,100" />
        <path d="M182,100 L190,100" />
      </svg>

      <div ref={logoRef} className="loader-logo" style={{ position: "absolute", opacity: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/trahbiz_logo.png" alt="Trahbiz" />
      </div>
    </div>
  );
}
