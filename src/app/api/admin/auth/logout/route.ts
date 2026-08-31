import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SESSION_OPTIONS } from '@/lib/session';
import type { AdminSession } from '@/lib/session';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<AdminSession>(cookieStore, SESSION_OPTIONS);
    session.destroy();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Çıkış yapılırken hata oluştu.' }, { status: 500 });
  }
}
