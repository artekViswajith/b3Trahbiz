import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Parse the DATABASE_URL to extract connection details
  const url = process.env.DATABASE_URL || "";
  let host = "localhost";
  let port = 3306;
  let user = "root";
  let password = "";
  let database = "trahbiz_cms";

  try {
    const parsed = new URL(url);
    host = parsed.hostname || "localhost";
    port = parseInt(parsed.port) || 3306;
    user = parsed.username || "root";
    password = parsed.password || "";
    database = parsed.pathname.replace("/", "") || "trahbiz_cms";
  } catch {
    // Use defaults if URL parsing fails
  }

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 5,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
