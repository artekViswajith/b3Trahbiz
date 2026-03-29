import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret";

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcryptjs.compare(password, hashed);
}

export function signToken(payload: { id: number; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { id: number; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
  } catch {
    return null;
  }
}

export async function getAdminFromToken(token: string) {
  const payload = verifyToken(token);
  if (!payload) return null;
  const user = await prisma.adminUser.findUnique({ where: { id: payload.id } });
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}
