import { NextRequest, NextResponse } from 'next/server';
import { revalidateSite } from '@/lib/revalidate';

async function getPrisma() { 
  const { prisma } = await import('@/lib/prisma'); 
  return prisma; 
}

export async function GET() {
  const prisma = await getPrisma();
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  const prisma = await getPrisma();
  const body = await req.json();
  const { id, authorName, rating, text, source, isApproved, showOnHome } = body;
  
  let review;
  if (id) {
    review = await prisma.review.update({ 
      where: { id: Number(id) }, 
      data: { 
        authorName, 
        rating: Number(rating), 
        text, 
        source, 
        isApproved: Boolean(isApproved), 
        showOnHome: Boolean(showOnHome) 
      } 
    });
  } else {
    if (!authorName?.trim() || !text?.trim()) {
      return NextResponse.json({ error: 'Ad ve yorum zorunludur.' }, { status: 400 });
    }
    review = await prisma.review.create({ 
      data: { 
        authorName, 
        rating: Number(rating ?? 5), 
        text, 
        source: source || 'form', 
        isApproved: Boolean(isApproved), 
        showOnHome: Boolean(showOnHome) 
      } 
    });
  }

  // Yorum ekle/düzenle → ana sayfa ve ilgili cache anında temizlenir
  revalidateSite('reviews');

  return NextResponse.json({ success: true, review });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prisma = await getPrisma();
  await prisma.review.delete({ where: { id: Number(searchParams.get('id')) } });
  revalidateSite('reviews');
  return NextResponse.json({ success: true });
}
