import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await prisma.contactCard.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  const maxSort = await prisma.contactCard.aggregate({ _max: { sortOrder: true } });
  const data = await prisma.contactCard.create({
    data: {
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
      title: body.title || "",
      email: body.email || "",
      phone: body.phone || "",
      address: body.address || "",
    },
  });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  if (!Array.isArray(body.contacts)) {
    return NextResponse.json({ error: "Expected contacts array" }, { status: 400 });
  }

  const results = [];
  for (const c of body.contacts) {
    if (c.id) {
      const updated = await prisma.contactCard.update({
        where: { id: c.id },
        data: {
          sortOrder: c.sortOrder,
          title: c.title,
          email: c.email,
          phone: c.phone,
          address: c.address,
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

  await prisma.contactCard.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
