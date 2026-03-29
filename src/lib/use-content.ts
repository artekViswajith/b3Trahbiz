"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────
   Shared fetcher with error handling
   ───────────────────────────────────── */
async function fetchContent<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(endpoint, { next: { revalidate: 60 } } as any);
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

/* ─────────────────────────────────────
   Hook: Hero Section
   ───────────────────────────────────── */
export interface HeroContent {
  kicker: string;
  headline: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const HERO_DEFAULTS: HeroContent = {
  kicker: "Premium Travel & Hospitality",
  headline: "Redefining Global Hospitality",
  subtitle: "Curated journeys across the world's most extraordinary destinations — where timeless wonder meets modern luxury.",
  ctaText: "Start Exploring",
  ctaLink: "#",
};

export function useHeroContent() {
  const [data, setData] = useState<HeroContent>(HERO_DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchContent("/api/content/hero", HERO_DEFAULTS).then((d) => { setData(d); setLoaded(true); });
  }, []);
  return { ...data, loaded };
}

/* ─────────────────────────────────────
   Hook: About Section
   ───────────────────────────────────── */
export interface AboutContent {
  kicker: string;
  title: string;
  leadText: string;
  subheading1: string;
  paragraph1: string;
  paragraph2: string;
  subheading2: string;
  paragraph3: string;
  listItems: string[];
  closingText: string;
}

const ABOUT_DEFAULTS: AboutContent = {
  kicker: "About B3 Group",
  title: "Our Legacy: Four Decades of Excellence, Reimagined for Hospitality",
  leadText: "For over four decades, B3 Group has stood as a vanguard of innovation, precision, and ethical business practices across international markets. Trahbiz carries that legacy into premium travel and hospitality.",
  subheading1: "Where Precision Meets Passion",
  paragraph1: "What began as a singular vision has grown into a dynamic conglomerate with modern corporate and manufacturing capabilities and a growing global footprint. Through verticals like B3 Acero, B3 Integra, B3 Aqua, B3 Autos, and beyond, we continue to deliver client-centered solutions that drive growth for everyone.",
  paragraph2: "Throughout our journey, deep technology adoption and dedicated research helped us transform industries. Our commitment to sustainable growth—through green practices like solar energy and efficient waste management—ensures our impact is responsible and future-ready.",
  subheading2: "A New Era in Hospitality: Introducing Trahbiz",
  paragraph3: "Trahbiz is the natural evolution of B3 Group's heritage. We are currently operating our flagship hotel, with a clear roadmap toward a larger chain of premier properties. We are not just hoteliers—we are your complete travel partner, bringing B3's signature reliability to every journey.",
  listItems: [
    "Curated Leisure Travel: Seamless, relaxing getaways tailored to your pace.",
    "Corporate & Business Travel: Streamlined, punctual, and highly reliable services for modern professionals.",
    "Tailor-Made Packages: Bespoke itineraries designed around your interests.",
    "Destination Weddings: Flawless celebrations executed with expert, stress-free planning.",
  ],
  closingText: "Backed by a proud decades-long foundation of innovation and a forward-looking commitment to sustainability, Trahbiz invites you to explore the world with confidence.",
};

export function useAboutContent() {
  const [data, setData] = useState<AboutContent>(ABOUT_DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchContent("/api/content/about", ABOUT_DEFAULTS).then((d) => { setData(d); setLoaded(true); });
  }, []);
  return { ...data, loaded };
}

/* ─────────────────────────────────────
   Hook: Features (Showcase)
   ───────────────────────────────────── */
export interface FeatureItem {
  id: number;
  number: string;
  title: string;
  description: string;
  iconSvg: string;
}

export function useFeatures() {
  const [data, setData] = useState<FeatureItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchContent<FeatureItem[]>("/api/content/features", []).then((d) => { setData(d); setLoaded(true); });
  }, []);
  return { features: data, loaded };
}

/* ─────────────────────────────────────
   Hook: Services (Horizontal Scroll)
   ───────────────────────────────────── */
export interface ServiceItem {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

export function useServices() {
  const [data, setData] = useState<ServiceItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchContent<ServiceItem[]>("/api/content/services", []).then((d) => { setData(d); setLoaded(true); });
  }, []);
  return { services: data, loaded };
}

/* ─────────────────────────────────────
   Hook: Properties
   ───────────────────────────────────── */
export interface PropertyItem {
  id: number;
  name: string;
  location: string;
  details: string;
  imageUrl: string;
}

export function useProperties() {
  const [data, setData] = useState<PropertyItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchContent<PropertyItem[]>("/api/content/properties", []).then((d) => { setData(d); setLoaded(true); });
  }, []);
  return { properties: data, loaded };
}

/* ─────────────────────────────────────
   Hook: Packages
   ───────────────────────────────────── */
export interface PackageItem {
  id: number;
  title: string;
  summary: string;
  imageUrl: string;
}

export function usePackages() {
  const [data, setData] = useState<PackageItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchContent<PackageItem[]>("/api/content/packages", []).then((d) => { setData(d); setLoaded(true); });
  }, []);
  return { packages: data, loaded };
}

/* ─────────────────────────────────────
   Hook: Contact Cards
   ───────────────────────────────────── */
export interface ContactCardItem {
  id: number;
  title: string;
  email: string;
  phone: string;
  address: string;
}

export function useContacts() {
  const [data, setData] = useState<ContactCardItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchContent<ContactCardItem[]>("/api/content/contacts", []).then((d) => { setData(d); setLoaded(true); });
  }, []);
  return { contacts: data, loaded };
}

/* ─────────────────────────────────────
   Hook: Site Settings (nav, social, footer)
   ───────────────────────────────────── */
export interface SiteSettingsData {
  settings: { siteName: string; siteTagline: string; logoUrl: string; metaTitle: string; metaDesc: string };
  navLinks: { label: string; href: string; isActive: boolean }[];
  socialLinks: { label: string; url: string; isActive: boolean }[];
  footer: { tagline: string; copyright: string };
}

const SETTINGS_DEFAULTS: SiteSettingsData = {
  settings: {
    siteName: "Trahbiz",
    siteTagline: "Redefining Global Hospitality",
    logoUrl: "/icons/trahbiz_logo.png",
    metaTitle: "Trahbiz — Redefining Global Hospitality",
    metaDesc: "Curated journeys across the world's most extraordinary destinations.",
  },
  navLinks: [
    { label: "Our Properties", href: "/our-properties", isActive: true },
    { label: "Our Packages", href: "/our-packages", isActive: true },
    { label: "About Us", href: "/about-us", isActive: true },
    { label: "Contact Us", href: "/contact-us", isActive: true },
  ],
  socialLinks: [
    { label: "Instagram", url: "#", isActive: true },
    { label: "LinkedIn", url: "#", isActive: true },
    { label: "Contact", url: "#", isActive: true },
  ],
  footer: {
    tagline: "Redefining Global Hospitality — Curated Journeys Since 2024",
    copyright: "Trahbiz. All rights reserved.",
  },
};

export function useSiteSettings() {
  const [data, setData] = useState<SiteSettingsData>(SETTINGS_DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchContent("/api/content/settings", SETTINGS_DEFAULTS).then((d) => { setData(d); setLoaded(true); });
  }, []);
  return { ...data, loaded };
}
