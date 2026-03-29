import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  let data = await prisma.aboutSection.findUnique({ where: { id: 1 } });
  if (!data) {
    data = {
      id: 1,
      kicker: "About B3 Group",
      title: "Our Legacy: Four Decades of Excellence, Reimagined for Hospitality",
      leadText: "For over four decades, B3 Group has stood as a vanguard of innovation, precision, and ethical business practices across international markets. Trahbiz carries that legacy into premium travel and hospitality.",
      subheading1: "Where Precision Meets Passion",
      paragraph1: "What began as a singular vision has grown into a dynamic conglomerate with modern corporate and manufacturing capabilities and a growing global footprint.",
      paragraph2: "Throughout our journey, deep technology adoption and dedicated research helped us transform industries.",
      subheading2: "A New Era in Hospitality: Introducing Trahbiz",
      paragraph3: "Trahbiz is the natural evolution of B3 Group's heritage.",
      listItems: JSON.stringify([
        "Curated Leisure Travel: Seamless, relaxing getaways tailored to your pace.",
        "Corporate & Business Travel: Streamlined, punctual, and highly reliable services for modern professionals.",
        "Tailor-Made Packages: Bespoke itineraries designed around your interests.",
        "Destination Weddings: Flawless celebrations executed with expert, stress-free planning.",
      ]),
      closingText: "Backed by a proud decades-long foundation of innovation and a forward-looking commitment to sustainability, Trahbiz invites you to explore the world with confidence.",
      updatedAt: new Date(),
    };
  }
  return NextResponse.json({ ...data, listItems: JSON.parse(data.listItems) });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  const data = await prisma.aboutSection.upsert({
    where: { id: 1 },
    update: {
      kicker: body.kicker,
      title: body.title,
      leadText: body.leadText,
      subheading1: body.subheading1,
      paragraph1: body.paragraph1,
      paragraph2: body.paragraph2,
      subheading2: body.subheading2,
      paragraph3: body.paragraph3,
      listItems: JSON.stringify(body.listItems || []),
      closingText: body.closingText,
    },
    create: {
      id: 1,
      kicker: body.kicker || "",
      title: body.title || "",
      leadText: body.leadText || "",
      subheading1: body.subheading1 || "",
      paragraph1: body.paragraph1 || "",
      paragraph2: body.paragraph2 || "",
      subheading2: body.subheading2 || "",
      paragraph3: body.paragraph3 || "",
      listItems: JSON.stringify(body.listItems || []),
      closingText: body.closingText || "",
    },
  });
  return NextResponse.json({ ...data, listItems: JSON.parse(data.listItems) });
}
