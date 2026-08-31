import { NextRequest, NextResponse } from 'next/server';

async function getPrisma() { 
  const { prisma } = await import('@/lib/prisma'); 
  return prisma; 
}

export async function GET() {
  const prisma = await getPrisma();
  const users = await prisma.user.findMany({ 
    select: { 
      id: true, 
      name: true, 
      email: true, 
      role: true, 
      isActive: true, 
      lastLoginAt: true, 
      createdAt: true 
    }, 
    orderBy: { createdAt: 'asc' } 
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const prisma = await getPrisma();
  const body = await req.json();
  const { id, name, email, role, isActive, password } = body;
  
  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Ad ve e-posta zorunludur.' }, { status: 400 });
  }
  if (!id && !password) {
    return NextResponse.json({ error: 'Yeni kullanıcı için şifre zorunludur.' }, { status: 400 });
  }
  
  const data: Record<string, unknown> = { 
    name: name.trim(), 
    email: email.toLowerCase().trim(), 
    role: role || 'editor', 
    isActive: Boolean(isActive ?? true) 
  };
  
  if (password?.trim()) {
    const bcrypt = await import('bcryptjs');
    data.passwordHash = await bcrypt.default.hash(password, 12);
  }
  
  try {
    if (id) {
      const u = await prisma.user.update({ where: { id: Number(id) }, data });
      const { passwordHash: _, ...safe } = u as typeof u & { passwordHash: string };
      return NextResponse.json({ success: true, user: safe });
    } else {
      const u = await prisma.user.create({ data: data as Parameters<typeof prisma.user.create>[0]['data'] });
      const { passwordHash: _, ...safe } = u as typeof u & { passwordHash: string };
      return NextResponse.json({ success: true, user: safe });
    }
  } catch (e: any) {
    if (String(e).includes('Unique constraint') || e.code === 'P2002') {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kayıtlı.' }, { status: 400 });
    }
    throw e;
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prisma = await getPrisma();
  
  // Optional: Prevent deleting self if we had context of who is logged in,
  // but standard backend doesn't have session here unless we fetch it.
  
  await prisma.user.delete({ where: { id: Number(searchParams.get('id')) } });
  return NextResponse.json({ success: true });
}
