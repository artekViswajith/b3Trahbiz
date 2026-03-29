import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL || "";
const parsed = new URL(url);

const adapter = new PrismaMariaDb({
  host: parsed.hostname,
  port: parsed.port ? Number(parsed.port) : 3306,
  user: decodeURIComponent(parsed.username || ""),
  password: decodeURIComponent(parsed.password || ""),
  database: (parsed.pathname || "").replace(/^\//, ""),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  /* ──────────────────────────────────────────
     1. Site Settings
     ────────────────────────────────────────── */
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      siteName: "Trahbiz",
      siteTagline: "Redefining Global Hospitality",
      logoUrl: "/icons/trahbiz_logo.png",
      metaTitle: "Trahbiz — Redefining Global Hospitality",
      metaDesc:
        "Curated journeys across the world's most extraordinary destinations — where timeless wonder meets modern luxury.",
    },
  });
  console.log("✅ Site Settings");

  /* ──────────────────────────────────────────
     2. Hero Section
     ────────────────────────────────────────── */
  await prisma.heroSection.upsert({
    where: { id: 1 },
    update: {},
    create: {
      kicker: "Premium Travel & Hospitality",
      headline: "Redefining Global Hospitality",
      subtitle:
        "Curated journeys across the world's most extraordinary destinations — where timeless wonder meets modern luxury.",
      ctaText: "Start Exploring",
      ctaLink: "#",
    },
  });
  console.log("✅ Hero Section");

  /* ──────────────────────────────────────────
     3. About Section
     ────────────────────────────────────────── */
  await prisma.aboutSection.upsert({
    where: { id: 1 },
    update: {},
    create: {
      kicker: "About B3 Group",
      title:
        "Our Legacy: Four Decades of Excellence, Reimagined for Hospitality",
      leadText:
        "For over four decades, B3 Group has stood as a vanguard of innovation, precision, and ethical business practices across international markets. Trahbiz carries that legacy into premium travel and hospitality.",
      subheading1: "Where Precision Meets Passion",
      paragraph1:
        "What began as a singular vision has grown into a dynamic conglomerate with modern corporate and manufacturing capabilities and a growing global footprint. Through verticals like B3 Acero, B3 Integra, B3 Aqua, B3 Autos, and beyond, we continue to deliver client-centered solutions that drive growth for everyone.",
      paragraph2:
        "Throughout our journey, deep technology adoption and dedicated research helped us transform industries. Our commitment to sustainable growth—through green practices like solar energy and efficient waste management—ensures our impact is responsible and future-ready.",
      subheading2: "A New Era in Hospitality: Introducing Trahbiz",
      paragraph3:
        "Trahbiz is the natural evolution of B3 Group's heritage. We are currently operating our flagship hotel, with a clear roadmap toward a larger chain of premier properties. We are not just hoteliers—we are your complete travel partner, bringing B3's signature reliability to every journey.",
      listItems: JSON.stringify([
        "Curated Leisure Travel: Seamless, relaxing getaways tailored to your pace.",
        "Corporate & Business Travel: Streamlined, punctual, and highly reliable services for modern professionals.",
        "Tailor-Made Packages: Bespoke itineraries designed around your interests.",
        "Destination Weddings: Flawless celebrations executed with expert, stress-free planning.",
      ]),
      closingText:
        "Backed by a proud decades-long foundation of innovation and a forward-looking commitment to sustainability, Trahbiz invites you to explore the world with confidence.",
    },
  });
  console.log("✅ About Section");

  /* ──────────────────────────────────────────
     4. Features (Showcase)
     ────────────────────────────────────────── */
  const features = [
    {
      sortOrder: 1,
      number: "01",
      title: "Heritage Circuits",
      description:
        "Meticulously curated routes through UNESCO heritage sites across continents — from medieval citadels to imperial masterpieces.",
      iconSvg: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="22" width="32" height="20" rx="1"/><path d="M14 22V14a10 10 0 0 1 20 0v8"/><line x1="24" y1="8" x2="24" y2="4"/><circle cx="24" cy="4" r="1.5"/><line x1="14" y1="42" x2="14" y2="22"/><line x1="24" y1="42" x2="24" y2="22"/><line x1="34" y1="42" x2="34" y2="22"/></svg>`,
    },
    {
      sortOrder: 2,
      number: "02",
      title: "Luxury Concierge",
      description:
        "24/7 dedicated travel concierge with private airport transfers, bespoke dining reservations, and VIP access.",
      iconSvg: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="18" r="8"/><path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16"/><path d="M20 18l2 2 6-6"/></svg>`,
    },
    {
      sortOrder: 3,
      number: "03",
      title: "Wildlife Expeditions",
      description:
        "Expert-led expeditions across iconic reserves worldwide — from African savannas to South American wetlands and Arctic frontiers.",
      iconSvg: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 36c0-6 4-10 12-10s12 4 12 10"/><ellipse cx="24" cy="20" rx="8" ry="6"/><circle cx="20" cy="18" r="1"/><circle cx="28" cy="18" r="1"/><path d="M8 24l-4-6"/><path d="M40 24l4-6"/></svg>`,
    },
    {
      sortOrder: 4,
      number: "04",
      title: "Culinary Journeys",
      description:
        "Private dining with royal chefs, spice trail walks, and street food crawls curated by local gastronomes.",
      iconSvg: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16"/><path d="M8 4v8a4 4 0 0 0 8 0V4"/><line x1="12" y1="20" x2="12" y2="44"/><path d="M36 4c0 0-4 4-4 12h8c0-8-4-12-4-12z"/><line x1="36" y1="16" x2="36" y2="44"/></svg>`,
    },
    {
      sortOrder: 5,
      number: "05",
      title: "Corporate Retreats",
      description:
        "End-to-end team offsite planning — destination venues, adventure team-building, and seamless logistics.",
      iconSvg: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="10" width="36" height="28" rx="2"/><line x1="6" y1="18" x2="42" y2="18"/><line x1="18" y1="18" x2="18" y2="38"/><rect x="10" y="22" width="4" height="4" rx="0.5"/><rect x="22" y="22" width="16" height="4" rx="0.5"/><rect x="22" y="30" width="10" height="4" rx="0.5"/></svg>`,
    },
    {
      sortOrder: 6,
      number: "06",
      title: "Wellness & Ayurveda",
      description:
        "Holistic wellness retreats across premier destinations — restorative therapies, yoga, and mindful renewal.",
      iconSvg: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 44V24"/><path d="M24 24c-8-2-14-10-14-18 8 2 14 10 14 18z"/><path d="M24 24c8-2 14-10 14-18-8 2-14 10-14 18z"/><path d="M18 40c0-3.314 2.686-6 6-6s6 2.686 6 6"/></svg>`,
    },
  ];

  // Clear existing features and insert fresh
  await prisma.feature.deleteMany();
  for (const f of features) {
    await prisma.feature.create({ data: f });
  }
  console.log("✅ Features (" + features.length + ")");

  /* ──────────────────────────────────────────
     5. Services (Horizontal Scroll)
     ────────────────────────────────────────── */
  const services = [
    {
      sortOrder: 1,
      number: "01",
      title: "Luxury Stays",
      subtitle: "Palace Hotels & Boutique Resorts",
      description:
        "Hand-picked heritage estates and world-class resorts — from overwater villas in the Maldives to alpine lodges in Switzerland.",
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    },
    {
      sortOrder: 2,
      number: "02",
      title: "Corporate Travel",
      subtitle: "Seamless Business Journeys",
      description:
        "End-to-end corporate travel management with VIP airport transfers, curated team offsites, and incentive travel experiences.",
      imageUrl:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    },
    {
      sortOrder: 3,
      number: "03",
      title: "Guided Tours",
      subtitle: "Expert-Led Cultural Immersions",
      description:
        "Walk through history with specialist guides — from Renaissance districts in Europe to sacred temples in Southeast Asia and medinas in North Africa.",
      imageUrl:
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
    },
    {
      sortOrder: 4,
      number: "04",
      title: "Wildlife Safaris",
      subtitle: "Into the Wild Corners of the World",
      description:
        "Track big cats on African game drives, encounter polar wildlife in the Arctic, or cruise through Amazon rainforests — all with expert naturalists.",
      imageUrl:
        "https://images.unsplash.com/photo-1615824996195-f780bba7cfab?w=600&q=80",
    },
    {
      sortOrder: 5,
      number: "05",
      title: "Culinary Experiences",
      subtitle: "A Feast for Every Sense",
      description:
        "Private dining with world-class chefs, market walks through global food capitals, and estate tastings — experience authentic flavors worldwide.",
      imageUrl:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
    },
  ];

  await prisma.service.deleteMany();
  for (const s of services) {
    await prisma.service.create({ data: s });
  }
  console.log("✅ Services (" + services.length + ")");

  /* ──────────────────────────────────────────
     6. Properties
     ────────────────────────────────────────── */
  const properties = [
    {
      sortOrder: 1,
      name: "Trahbiz Signature Hotel",
      location: "Bengaluru, India",
      details:
        "Our flagship property blending contemporary luxury with business-ready infrastructure and personalized concierge service.",
    },
    {
      sortOrder: 2,
      name: "Trahbiz City Residences",
      location: "Dubai, UAE",
      details:
        "Premium serviced residences for extended stays, executive travel, and high-comfort city living.",
    },
    {
      sortOrder: 3,
      name: "Trahbiz Seaside Retreat",
      location: "Bali, Indonesia",
      details:
        "A leisure-focused coastal property curated for wellness escapes, private events, and destination celebrations.",
    },
    {
      sortOrder: 4,
      name: "Trahbiz Alpine Lodge",
      location: "Interlaken, Switzerland",
      details:
        "Boutique mountain hospitality designed for luxury leisure and team retreats in scenic alpine surroundings.",
    },
    {
      sortOrder: 5,
      name: "Trahbiz Heritage Residence",
      location: "Lisbon, Portugal",
      details:
        "A restored heritage address offering immersive local experiences with modern hospitality standards.",
    },
    {
      sortOrder: 6,
      name: "Trahbiz Waterfront Suites",
      location: "Singapore",
      details:
        "Strategic urban waterfront accommodation with seamless access for corporate and premium family travel.",
    },
  ];

  await prisma.property.deleteMany();
  for (const p of properties) {
    await prisma.property.create({ data: p });
  }
  console.log("✅ Properties (" + properties.length + ")");

  /* ──────────────────────────────────────────
     7. Packages
     ────────────────────────────────────────── */
  const packages = [
    {
      sortOrder: 1,
      title: "Executive Mobility",
      summary:
        "End-to-end corporate travel planning with managed itineraries, airport assistance, and priority support.",
    },
    {
      sortOrder: 2,
      title: "Luxury Leisure Collection",
      summary:
        "Premium leisure journeys with curated stays, private transfers, and destination-specific experiences.",
    },
    {
      sortOrder: 3,
      title: "Destination Celebrations",
      summary:
        "Seamless planning for weddings, milestone events, and family gatherings in iconic locations worldwide.",
    },
    {
      sortOrder: 4,
      title: "Adventure & Nature Expeditions",
      summary:
        "Guided immersive adventures including wildlife, mountain, and marine exploration experiences.",
    },
    {
      sortOrder: 5,
      title: "Wellness Rebalance Journeys",
      summary:
        "Holistic travel programs focused on recovery, mindfulness, and high-comfort rejuvenation.",
    },
    {
      sortOrder: 6,
      title: "Custom Global Itineraries",
      summary:
        "Fully bespoke packages designed around personal preferences, pace, and regional interests.",
    },
  ];

  await prisma.package.deleteMany();
  for (const p of packages) {
    await prisma.package.create({ data: p });
  }
  console.log("✅ Packages (" + packages.length + ")");

  /* ──────────────────────────────────────────
     8. Contact Cards
     ────────────────────────────────────────── */
  const contacts = [
    {
      sortOrder: 1,
      title: "General Enquiries",
      email: "hello@trahbiz.com",
      phone: "+91 80 0000 0000",
    },
    {
      sortOrder: 2,
      title: "Corporate Desk",
      email: "corporate@trahbiz.com",
      phone: "+971 4 000 0000",
    },
  ];

  await prisma.contactCard.deleteMany();
  for (const c of contacts) {
    await prisma.contactCard.create({ data: c });
  }
  console.log("✅ Contact Cards (" + contacts.length + ")");

  /* ──────────────────────────────────────────
     9. Nav Links
     ────────────────────────────────────────── */
  const navLinks = [
    { sortOrder: 1, label: "Our Properties", href: "/our-properties" },
    { sortOrder: 2, label: "Our Packages", href: "/our-packages" },
    { sortOrder: 3, label: "About Us", href: "/about-us" },
    { sortOrder: 4, label: "Contact Us", href: "/contact-us" },
  ];

  await prisma.navLink.deleteMany();
  for (const n of navLinks) {
    await prisma.navLink.create({ data: n });
  }
  console.log("✅ Nav Links (" + navLinks.length + ")");

  /* ──────────────────────────────────────────
     10. Social Links
     ────────────────────────────────────────── */
  const socialLinks = [
    { sortOrder: 1, label: "Instagram", url: "#" },
    { sortOrder: 2, label: "LinkedIn", url: "#" },
    { sortOrder: 3, label: "Contact", url: "#" },
  ];

  await prisma.socialLink.deleteMany();
  for (const s of socialLinks) {
    await prisma.socialLink.create({ data: s });
  }
  console.log("✅ Social Links (" + socialLinks.length + ")");

  /* ──────────────────────────────────────────
     11. Footer Settings
     ────────────────────────────────────────── */
  await prisma.footerSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      tagline: "Redefining Global Hospitality — Curated Journeys Since 2024",
      copyright: "Trahbiz. All rights reserved.",
    },
  });
  console.log("✅ Footer Settings");

  /* ──────────────────────────────────────────
     12. Default Admin User
     ────────────────────────────────────────── */
  const existingAdmin = await prisma.adminUser.findFirst();
  if (!existingAdmin) {
    const hashed = await bcrypt.hash("admin123", 12);
    await prisma.adminUser.create({
      data: {
        email: "admin@trahbiz.com",
        password: hashed,
        name: "Admin",
        role: "superadmin",
      },
    });
    console.log("✅ Default admin: admin@trahbiz.com / admin123");
  } else {
    console.log("ℹ️  Admin user already exists, skipped.");
  }

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
