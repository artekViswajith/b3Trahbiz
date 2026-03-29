import { NextRequest, NextResponse } from "next/server";
import { getAdminFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("admin_token");
  const token = cookie?.value || "";
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  const admin = await getAdminFromToken(token);
  if (!admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: admin });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
  return response;
}
