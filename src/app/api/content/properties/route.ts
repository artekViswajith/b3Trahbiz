import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await prisma.property.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  const maxSort = await prisma.property.aggregate({ _max: { sortOrder: true } });
  const data = await prisma.property.create({
    data: {
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
      name: body.name || "",
      location: body.location || "",
      details: body.details || "",
      imageUrl: body.imageUrl || "",
    },
  });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  if (!Array.isArray(body.properties)) {
    return NextResponse.json({ error: "Expected properties array" }, { status: 400 });
  }

  const results = [];
  for (const p of body.properties) {
    if (p.id) {
      const updated = await prisma.property.update({
        where: { id: p.id },
        data: {
          sortOrder: p.sortOrder,
          name: p.name,
          location: p.location,
          details: p.details,
          imageUrl: p.imageUrl,
        },
      });
      results.push(updated);
    }
  }
  return NextResponse.json(results);
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.property.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
