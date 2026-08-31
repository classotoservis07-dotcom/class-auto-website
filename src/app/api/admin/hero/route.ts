import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';

// Hero bölümünü getir
export async function GET() {
  try {
    const hero = await prisma.heroSection.findFirst();
    return NextResponse.json({ hero });
  } catch {
    return NextResponse.json({ error: 'Hero yüklenemedi' }, { status: 500 });
  }
}

// Hero bölümünü güncelle veya oluştur
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const hero = await prisma.heroSection.upsert({
      where: { id: 1 },
      update: {
        title: data.title,
        subtitle: data.subtitle,
        desktopImage: data.desktopImage ?? '',
        mobileImage: data.mobileImage ?? '',
        overlayOpacity: parseInt(String(data.overlayOpacity ?? '60')),
        height: data.height ?? '90vh',
        textAlign: data.textAlign ?? 'left',
        btn1Text: data.btn1Text,
        btn1Url: data.btn1Url,
        btn2Text: data.btn2Text,
        btn2Url: data.btn2Url,
        btn3Text: data.btn3Text,
        btn3Url: data.btn3Url,
        trustBadges: data.trustBadges ?? '[]',
        isActive: Boolean(data.isActive),
        updatedAt: new Date(),
      },
      create: {
        id: 1,
        title: data.title ?? 'Aracınız İçin Güvenilir ve Profesyonel Servis',
        subtitle: data.subtitle ?? '',
        desktopImage: data.desktopImage ?? '',
        mobileImage: data.mobileImage ?? '',
        overlayOpacity: parseInt(String(data.overlayOpacity ?? '60')),
        height: data.height ?? '90vh',
        textAlign: data.textAlign ?? 'left',
        btn1Text: data.btn1Text ?? "WhatsApp'tan Randevu Al",
        btn1Url: data.btn1Url ?? '#',
        btn2Text: data.btn2Text ?? 'Hemen Ara',
        btn2Url: data.btn2Url ?? '#',
        btn3Text: data.btn3Text ?? 'Hizmetleri İncele',
        btn3Url: data.btn3Url ?? '/hizmetler',
        trustBadges: data.trustBadges ?? '[]',
        isActive: Boolean(data.isActive ?? true),
        updatedAt: new Date(),
      },
    });

    await prisma.activityLog.create({
      data: { action: 'hero_updated', target: 'HeroSection' },
    }).catch(() => {});

    // Cache temizle
    revalidateTag('hero', 'max');
    revalidatePath('/', 'page');

    return NextResponse.json({ success: true, hero });
  } catch (error) {
    console.error('[Hero API]:', error);
    return NextResponse.json({ error: 'Hero kaydedilemedi' }, { status: 500 });
  }
}
