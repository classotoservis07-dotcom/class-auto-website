/**
 * CLASS AUTO — Prisma Client
 *
 * - Lokal geliştirme: SQLite
 * - Production (Vercel + Turso): LibSQL cloud database
 */

import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  // Production: Turso/LibSQL
  if (tursoUrl && tursoToken) {
    const libsql = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });
    const adapter = new PrismaLibSql(libsql);
    return new PrismaClient({ adapter, log: ['error'] } as ConstructorParameters<typeof PrismaClient>[0]);
  }

  // Development: yerel SQLite
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma: PrismaClient =
  globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
