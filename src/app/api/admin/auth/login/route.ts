import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { SESSION_OPTIONS } from '@/lib/session';
import type { AdminSession } from '@/lib/session';

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'E-posta ve şifre alanlarını doldurun.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'E-posta veya şifre hatalı.' }, { status: 401 });
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Hesabınız kilitlendi. ${remaining} dakika sonra tekrar deneyin.` },
        { status: 403 }
      );
    }

    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      const newAttempts = (user.loginAttempts ?? 0) + 1;
      const shouldLock = newAttempts >= MAX_ATTEMPTS;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: newAttempts,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS) : null,
        },
      });
      if (shouldLock) {
        return NextResponse.json({ error: 'Çok fazla hatalı deneme. Hesabınız 15 dakika kilitlendi.' }, { status: 403 });
      }
      return NextResponse.json(
        { error: `E-posta veya şifre hatalı. ${MAX_ATTEMPTS - newAttempts} deneme hakkınız kaldı.` },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    await prisma.activityLog.create({
      data: { userId: user.id, action: 'login', ipAddress: ip.split(',')[0].trim() },
    }).catch(() => {});

    // iron-session v8: cookies() returns ReadonlyRequestCookies
    const cookieStore = await cookies();
    const session = await getIronSession<AdminSession>(cookieStore, SESSION_OPTIONS);
    session.userId = user.id;
    session.email = user.email;
    session.name = user.name;
    session.role = user.role;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Login]:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
