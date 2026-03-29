import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await prisma.package.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  const maxSort = await prisma.package.aggregate({ _max: { sortOrder: true } });
  const data = await prisma.package.create({
    data: {
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
      title: body.title || "",
      summary: body.summary || "",
      imageUrl: body.imageUrl || "",
    },
  });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  if (!Array.isArray(body.packages)) {
    return NextResponse.json({ error: "Expected packages array" }, { status: 400 });
  }

  const results = [];
  for (const p of body.packages) {
    if (p.id) {
      const updated = await prisma.package.update({
        where: { id: p.id },
        data: {
          sortOrder: p.sortOrder,
          title: p.title,
          summary: p.summary,
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

  await prisma.package.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
