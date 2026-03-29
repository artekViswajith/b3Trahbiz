import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  const maxSort = await prisma.service.aggregate({ _max: { sortOrder: true } });
  const data = await prisma.service.create({
    data: {
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
      number: body.number || String((maxSort._max.sortOrder ?? 0) + 1).padStart(2, "0"),
      title: body.title || "",
      subtitle: body.subtitle || "",
      description: body.description || "",
      imageUrl: body.imageUrl || "",
    },
  });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  if (!Array.isArray(body.services)) {
    return NextResponse.json({ error: "Expected services array" }, { status: 400 });
  }

  const results = [];
  for (const s of body.services) {
    if (s.id) {
      const updated = await prisma.service.update({
        where: { id: s.id },
        data: {
          sortOrder: s.sortOrder,
          number: s.number,
          title: s.title,
          subtitle: s.subtitle,
          description: s.description,
          imageUrl: s.imageUrl,
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

  await prisma.service.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
