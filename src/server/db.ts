import { env } from "~/env";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Define the shape of our global object to keep TypeScript happy
interface GlobalForPrisma {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
}

const globalForPrisma = globalThis as unknown as GlobalForPrisma;

const initPrisma = () => {
  // Reuse existing pool or create a new one
  const pool =
    globalForPrisma.pgPool ?? new Pool({ connectionString: env.DATABASE_URL });

  // Persist the pool globally in development
  if (env.NODE_ENV !== "production") globalForPrisma.pgPool = pool;

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

// 3. Export the singleton instance
export const db = globalForPrisma.prisma ?? initPrisma();

// 4. Persist the client globally in development
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
