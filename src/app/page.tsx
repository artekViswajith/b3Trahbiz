"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import Showcase from "@/components/Showcase";
import Footer from "@/components/Footer";

const HorizontalScroll = dynamic(() => import("@/components/HorizontalScroll"), {
  ssr: false,
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Only render client-only components after first mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  // Server render and first client render must match: just an empty shell
  if (!mounted) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#fafafa",
          zIndex: 9999,
        }}
      />
    );
  }

  return (
    <>
      <Loader onComplete={handleLoaderComplete} />

      <SmoothScroll>
        <main>
          <Hero loaded={loaded} />
          <AboutUs />
          <Showcase />
          <HorizontalScroll />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
