import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

async function getPrisma() {
  const { prisma } = await import('@/lib/prisma');
  return prisma;
}

// GET — tüm aktif hero slide'ları
export async function GET() {
  try {
    const prisma = await getPrisma();
    const slides = await prisma.heroSlide.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json({ slides });
  } catch (error) {
    return NextResponse.json({ error: 'DB hatası' }, { status: 500 });
  }
}

// POST — yeni slide ekle veya güncelle
export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const body = await req.json();
    const {
      id, title, subtitle, bgImage, overlayOpacity,
      btn1Text, btn1Url, btn2Text, btn2Url,
      badgeText, isActive, sortOrder,
    } = body;

    if (!title?.trim() || !subtitle?.trim()) {
      return NextResponse.json({ error: 'Başlık ve alt yazı zorunludur' }, { status: 400 });
    }

    const data = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      bgImage: bgImage || null,
      overlayOpacity: Number(overlayOpacity ?? 55),
      btn1Text: btn1Text || "WhatsApp'tan Randevu Al",
      btn1Url: btn1Url || '/iletisim',
      btn2Text: btn2Text || 'Hizmetlerimiz',
      btn2Url: btn2Url || '/hizmetler',
      badgeText: badgeText || null,
      isActive: Boolean(isActive ?? true),
      sortOrder: Number(sortOrder ?? 0),
    };

    let slide;
    if (id) {
      slide = await prisma.heroSlide.update({ where: { id: Number(id) }, data });
    } else {
      slide = await prisma.heroSlide.create({ data });
    }

    revalidateTag('hero', 'max');
    return NextResponse.json({ success: true, slide });
  } catch (error) {
    return NextResponse.json({ error: 'Kayıt hatası' }, { status: 500 });
  }
}

// DELETE — sil
export async function DELETE(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

    await prisma.heroSlide.delete({ where: { id: Number(id) } });
    revalidateTag('hero', 'max');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Silme hatası' }, { status: 500 });
  }
}
