import { NextRequest, NextResponse } from 'next/server';

async function getPrisma() { 
  const { prisma } = await import('@/lib/prisma'); 
  return prisma; 
}

export async function GET() {
  const prisma = await getPrisma();
  const redirects = await prisma.redirect.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ redirects });
}

export async function POST(req: NextRequest) {
  const prisma = await getPrisma();
  const body = await req.json();
  const { id, from, to, type, isActive } = body;
  
  if (!from?.trim() || !to?.trim()) {
    return NextResponse.json({ error: 'Kaynak ve hedef URL zorunludur.' }, { status: 400 });
  }
  
  const data = { 
    from: from.trim(), 
    to: to.trim(), 
    type: Number(type ?? 301), 
    isActive: Boolean(isActive ?? true) 
  };
  
  try {
    if (id) {
      const r = await prisma.redirect.update({ where: { id: Number(id) }, data });
      return NextResponse.json({ success: true, redirect: r });
    } else {
      const r = await prisma.redirect.create({ data });
      return NextResponse.json({ success: true, redirect: r });
    }
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Bu kaynak URL zaten kullanımda.' }, { status: 400 });
    }
    throw e;
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prisma = await getPrisma();
  await prisma.redirect.delete({ where: { id: Number(searchParams.get('id')) } });
  return NextResponse.json({ success: true });
}
