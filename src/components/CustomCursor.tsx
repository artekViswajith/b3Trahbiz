"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

  const animate = useCallback(() => {
    pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
    pos.current.y = lerp(pos.current.y, target.current.y, 0.15);

    if (dotRef.current) {
      dotRef.current.style.left = `${pos.current.x}px`;
      dotRef.current.style.top = `${pos.current.y}px`;
    }

    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onMouseEnterInteractive = () => {
      dotRef.current?.classList.add("hovering");
    };

    const onMouseLeaveInteractive = () => {
      dotRef.current?.classList.remove("hovering");
    };

    // Track mouse movement
    window.addEventListener("mousemove", onMouseMove);

    // Observe DOM for interactive elements
    const attachListeners = () => {
      const interactives = document.querySelectorAll(
        'a, button, [data-clickable], .magnetic-btn, .service-card, .close-btn, .showcase-card'
      );
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterInteractive);
        el.addEventListener("mouseleave", onMouseLeaveInteractive);
      });
      return interactives;
    };

    // Initial attach
    let currentEls = attachListeners();

    // Re-attach when DOM changes
    const observer = new MutationObserver(() => {
      currentEls.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
      currentEls = attachListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Start animation loop
    raf.current = requestAnimationFrame(animate);

    // Entry animation
    gsap.fromTo(
      dotRef.current,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.6, delay: 0.3, ease: "back.out(2)" }
    );

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf.current);
      observer.disconnect();
      currentEls.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };
  }, [animate]);

  return <div ref={dotRef} className="cursor-dot" />;
}
