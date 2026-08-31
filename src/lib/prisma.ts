/**
 * CLASS AUTO — Prisma Client
 *
 * - Lokal geliştirme (NODE_ENV=development): SQLite dosyası kullanır
 * - Production (Vercel): Turso/LibSQL bulut veritabanı kullanır
 *   Gerekli env değişkenleri: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN
 */

import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  // Production: Turso/LibSQL kullan
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    // Dynamic import to avoid bundling libsql in dev
    const { createClient } = require('@libsql/client');
    const { PrismaLibSQL } = require('@prisma/adapter-libsql');

    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({
      adapter,
      log: ['error'],
    } as ConstructorParameters<typeof PrismaClient>[0]);
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
