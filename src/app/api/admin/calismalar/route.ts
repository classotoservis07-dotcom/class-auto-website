import { NextRequest, NextResponse } from 'next/server';
import { revalidateSite } from '@/lib/revalidate';

async function getPrisma() {
  const { prisma } = await import('@/lib/prisma');
  return prisma;
}

/** Slug üret — Türkçe karakter desteği */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// GET — tüm çalışmaları listele (admin)
export async function GET() {
  try {
    const prisma = await getPrisma();
    const works = await prisma.work.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ works });
  } catch {
    return NextResponse.json({ error: 'Yüklenemedi' }, { status: 500 });
  }
}

// POST — yeni ekle veya güncelle (id varsa güncelle)
export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const body = await req.json();
    const {
      id,
      title,
      shortDesc,
      coverImage,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      category,
      status,
      showOnHome,
      sortOrder,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Başlık zorunludur.' }, { status: 400 });
    }

    const data = {
      title: title.trim(),
      shortDesc: shortDesc || null,
      coverImage: coverImage || null,
      vehicleBrand: vehicleBrand || null,
      vehicleModel: vehicleModel || null,
      vehicleYear: vehicleYear ? Number(vehicleYear) || null : null,
      category: category || 'diger',
      status: status || 'published',
      showOnHome: Boolean(showOnHome ?? true),
      sortOrder: Number(sortOrder ?? 0),
    };

    let work;
    if (id) {
      work = await prisma.work.update({
        where: { id: Number(id) },
        data,
      });
    } else {
      // Benzersiz slug üret
      const base = slugify(title);
      let slug = base;
      let counter = 1;
      while (await prisma.work.findUnique({ where: { slug } })) {
        slug = `${base}-${counter++}`;
      }
      work = await prisma.work.create({
        data: { ...data, slug },
      });
    }

    // Ziyaretçi sitesini güncelle
    revalidateSite('works');

    return NextResponse.json({ success: true, work });
  } catch (error) {
    console.error('[Calismalar POST]', error);
    return NextResponse.json({ error: 'Kayıt hatası' }, { status: 500 });
  }
}

// DELETE — sil
export async function DELETE(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

    await prisma.work.delete({ where: { id } });
    revalidateSite('works');

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Silme hatası' }, { status: 500 });
  }
}
