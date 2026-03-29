import { NextRequest, NextResponse } from "next/server";
import { getAdminFromToken } from "@/lib/auth";

export async function requireAdmin(req: NextRequest) {
  const cookie = req.cookies.get("admin_token");
  const header = req.headers.get("authorization");
  const token = cookie?.value || header?.replace("Bearer ", "") || "";

  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), admin: null };
  }

  const admin = await getAdminFromToken(token);
  if (!admin) {
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }), admin: null };
  }

  return { error: null, admin };
}
