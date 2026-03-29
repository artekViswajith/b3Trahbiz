import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const [settings, navLinks, socialLinks, footer] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.navLink.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.footerSettings.findUnique({ where: { id: 1 } }),
  ]);

  return NextResponse.json({
    settings: settings || {
      id: 1,
      siteName: "Trahbiz",
      siteTagline: "Redefining Global Hospitality",
      logoUrl: "/icons/trahbiz_logo.png",
      metaTitle: "Trahbiz — Redefining Global Hospitality",
      metaDesc: "Curated journeys across the world's most extraordinary destinations.",
    },
    navLinks: navLinks.length
      ? navLinks
      : [
          { id: 1, sortOrder: 1, label: "Our Properties", href: "/our-properties", isActive: true },
          { id: 2, sortOrder: 2, label: "Our Packages", href: "/our-packages", isActive: true },
          { id: 3, sortOrder: 3, label: "About Us", href: "/about-us", isActive: true },
          { id: 4, sortOrder: 4, label: "Contact Us", href: "/contact-us", isActive: true },
        ],
    socialLinks: socialLinks.length
      ? socialLinks
      : [
          { id: 1, sortOrder: 1, label: "Instagram", url: "#", isActive: true },
          { id: 2, sortOrder: 2, label: "LinkedIn", url: "#", isActive: true },
          { id: 3, sortOrder: 3, label: "Contact", url: "#", isActive: true },
        ],
    footer: footer || {
      id: 1,
      tagline: "Redefining Global Hospitality — Curated Journeys Since 2024",
      copyright: "Trahbiz. All rights reserved.",
    },
  });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();

  const results: Record<string, any> = {};

  if (body.settings) {
    results.settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: body.settings,
      create: { id: 1, ...body.settings },
    });
  }

  if (body.footer) {
    results.footer = await prisma.footerSettings.upsert({
      where: { id: 1 },
      update: body.footer,
      create: { id: 1, ...body.footer },
    });
  }

  if (Array.isArray(body.navLinks)) {
    // Delete all and re-create
    await prisma.navLink.deleteMany();
    results.navLinks = await Promise.all(
      body.navLinks.map((link: any, i: number) =>
        prisma.navLink.create({
          data: {
            sortOrder: i + 1,
            label: link.label,
            href: link.href,
            isActive: link.isActive ?? true,
          },
        })
      )
    );
  }

  if (Array.isArray(body.socialLinks)) {
    await prisma.socialLink.deleteMany();
    results.socialLinks = await Promise.all(
      body.socialLinks.map((link: any, i: number) =>
        prisma.socialLink.create({
          data: {
            sortOrder: i + 1,
            label: link.label,
            url: link.url,
            isActive: link.isActive ?? true,
          },
        })
      )
    );
  }

  return NextResponse.json(results);
}
