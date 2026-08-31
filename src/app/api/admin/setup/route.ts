import { NextRequest, NextResponse } from 'next/server';

// Dynamic imports to avoid build-time prisma issues
async function getPrisma() {
  const { prisma } = await import('@/lib/prisma');
  return prisma;
}

export async function GET() {
  try {
    const prisma = await getPrisma();
    const userCount = await prisma.user.count();
    return NextResponse.json({ setupRequired: userCount === 0 });
  } catch (err) {
    console.warn('[Setup GET] DB error:', err);
    // DB henüz hazır değil — setup gerekli kabul et
    return NextResponse.json({ setupRequired: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();

    let userCount = 0;
    try {
      userCount = await prisma.user.count();
    } catch {
      userCount = 0;
    }

    if (userCount > 0) {
      return NextResponse.json(
        { error: 'Kurulum zaten tamamlanmış. Lütfen giriş yapın.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Tüm alanları doldurun.' }, { status: 400 });
    }
    if (String(name).trim().length < 2) {
      return NextResponse.json({ error: 'Ad Soyad en az 2 karakter olmalıdır.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 });
    }
    if (String(password).length < 8) {
      return NextResponse.json({ error: 'Şifre en az 8 karakter olmalıdır.' }, { status: 400 });
    }
    if (!/\d/.test(String(password))) {
      return NextResponse.json({ error: 'Şifre en az bir rakam içermelidir.' }, { status: 400 });
    }

    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.default.hash(String(password), 12);

    await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: String(email).toLowerCase().trim(),
        passwordHash,
        role: 'admin',
        isActive: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Setup POST]:', error);
    return NextResponse.json({ error: 'Sunucu hatası: ' + String(error) }, { status: 500 });
  }
}
