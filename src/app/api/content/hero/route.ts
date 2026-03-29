import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

// GET — public, returns hero content
export async function GET() {
  let data = await prisma.heroSection.findUnique({ where: { id: 1 } });
  if (!data) {
    // Return defaults if not seeded
    data = {
      id: 1,
      kicker: "Premium Travel & Hospitality",
      headline: "Redefining Global Hospitality",
      subtitle: "Curated journeys across the world's most extraordinary destinations — where timeless wonder meets modern luxury.",
      ctaText: "Start Exploring",
      ctaLink: "#",
      updatedAt: new Date(),
    };
  }
  return NextResponse.json(data);
}

// PUT — admin only
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  const data = await prisma.heroSection.upsert({
    where: { id: 1 },
    update: {
      kicker: body.kicker,
      headline: body.headline,
      subtitle: body.subtitle,
      ctaText: body.ctaText,
      ctaLink: body.ctaLink,
    },
    create: {
      id: 1,
      kicker: body.kicker || "Premium Travel & Hospitality",
      headline: body.headline || "Redefining Global Hospitality",
      subtitle: body.subtitle || "",
      ctaText: body.ctaText || "Start Exploring",
      ctaLink: body.ctaLink || "#",
    },
  });
  return NextResponse.json(data);
}
