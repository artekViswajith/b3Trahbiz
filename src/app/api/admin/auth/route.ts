import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, action, name, setupKey } = body;

    // ── Register first admin (requires setup key) ──
    if (action === "register") {
      if (setupKey !== process.env.ADMIN_SETUP_KEY) {
        return NextResponse.json({ error: "Invalid setup key" }, { status: 403 });
      }
      const existing = await prisma.adminUser.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "User already exists" }, { status: 409 });
      }
      const hashed = await hashPassword(password);
      const user = await prisma.adminUser.create({
        data: { email, password: hashed, name: name || "Admin" },
      });
      const token = signToken({ id: user.id, email: user.email, role: user.role });

      const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return response;
    }

    // ── Login ──
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (err: any) {
    console.error("Auth error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
