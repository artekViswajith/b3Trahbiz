import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

// GET — public
export async function GET() {
  const data = await prisma.feature.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(data);
}

// POST — admin: create new feature
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  const maxSort = await prisma.feature.aggregate({ _max: { sortOrder: true } });
  const data = await prisma.feature.create({
    data: {
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
      number: body.number || String((maxSort._max.sortOrder ?? 0) + 1).padStart(2, "0"),
      title: body.title || "",
      description: body.description || "",
      iconSvg: body.iconSvg || "",
    },
  });
  return NextResponse.json(data, { status: 201 });
}

// PUT — admin: bulk update
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  if (!Array.isArray(body.features)) {
    return NextResponse.json({ error: "Expected features array" }, { status: 400 });
  }

  const results = [];
  for (const f of body.features) {
    if (f.id) {
      const updated = await prisma.feature.update({
        where: { id: f.id },
        data: {
          sortOrder: f.sortOrder,
          number: f.number,
          title: f.title,
          description: f.description,
          iconSvg: f.iconSvg,
        },
      });
      results.push(updated);
    }
  }
  return NextResponse.json(results);
}

// DELETE — admin
export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.feature.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
