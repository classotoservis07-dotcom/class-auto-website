import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import type { AdminSession } from '@/lib/session';
import { SESSION_OPTIONS } from '@/lib/session';

/** Admin oturumunu doğrular. Başarısız ise null döner. */
export async function getAdminSession(req: NextRequest, res: NextResponse) {
  const session = await getIronSession<AdminSession>(req, res, SESSION_OPTIONS);
  if (!session.isLoggedIn) return null;
  return session;
}

/** Admin Route için middleware kontrolü */
export async function requireAdmin(req: NextRequest): Promise<AdminSession | null> {
  const res = new NextResponse();
  const session = await getIronSession<AdminSession>(req, res, SESSION_OPTIONS);
  if (!session.isLoggedIn) return null;
  return session;
}
