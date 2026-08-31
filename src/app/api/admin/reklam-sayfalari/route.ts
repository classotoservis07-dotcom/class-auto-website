import { NextRequest, NextResponse } from 'next/server';

async function getPrisma() { 
  const { prisma } = await import('@/lib/prisma'); 
  return prisma; 
}

export async function GET() {
  const prisma = await getPrisma();
  const pages = await prisma.landingPage.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  const prisma = await getPrisma();
  const body = await req.json();
  const { id, slug, title, headline, content, serviceType, metaTitle, metaDesc, isActive, heroImage } = body;
  
  if (!title?.trim()) {
    return NextResponse.json({ error: 'Başlık zorunludur.' }, { status: 400 });
  }
  
  const data = { 
    title, 
    headline: headline || '', 
    content: content || null, 
    slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), 
    serviceType: serviceType || null, 
    metaTitle: metaTitle || null, 
    metaDesc: metaDesc || null, 
    isActive: Boolean(isActive ?? true), 
    heroImage: heroImage || null 
  };
  
  try {
    if (id) {
      const p = await prisma.landingPage.update({ where: { id: Number(id) }, data });
      return NextResponse.json({ success: true, page: p });
    } else {
      const p = await prisma.landingPage.create({ data });
      return NextResponse.json({ success: true, page: p });
    }
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Bu URL yolu (slug) zaten kullanımda.' }, { status: 400 });
    }
    throw e;
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prisma = await getPrisma();
  await prisma.landingPage.delete({ where: { id: Number(searchParams.get('id')) } });
  return NextResponse.json({ success: true });
}
