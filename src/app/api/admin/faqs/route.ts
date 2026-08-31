import { NextRequest, NextResponse } from 'next/server';
import { revalidateSite } from '@/lib/revalidate';

async function getPrisma() { 
  const { prisma } = await import('@/lib/prisma'); 
  return prisma; 
}

export async function GET() {
  const prisma = await getPrisma();
  const faqs = await prisma.fAQ.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  return NextResponse.json({ faqs });
}

export async function POST(req: NextRequest) {
  const { prisma } = await import('@/lib/prisma');
  const body = await req.json();
  const { id, question, answer, category, isActive, sortOrder } = body;
  
  if (!question?.trim() || !answer?.trim()) {
    return NextResponse.json({ error: 'Soru ve cevap zorunludur.' }, { status: 400 });
  }
  
  let faq;
  if (id) {
    faq = await prisma.fAQ.update({ 
      where: { id: Number(id) }, 
      data: { 
        question, 
        answer, 
        category: category || null, 
        isActive: Boolean(isActive), 
        sortOrder: Number(sortOrder ?? 0) 
      } 
    });
  } else {
    faq = await prisma.fAQ.create({ 
      data: { 
        question, 
        answer, 
        category: category || null, 
        isActive: Boolean(isActive ?? true), 
        sortOrder: Number(sortOrder ?? 0) 
      } 
    });
  }

  // Ziyaretçi sitesi cache'ini temizle — SSS sayfası ve ana sayfa anında güncellenir
  revalidateSite('faqs');

  return NextResponse.json({ success: true, faq });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  const { prisma } = await import('@/lib/prisma');
  
  await prisma.fAQ.delete({ where: { id } });
  revalidateSite('faqs');
  
  return NextResponse.json({ success: true });
}
