import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get('group');

    const settings = await prisma.siteSetting.findMany({
      where: group ? { group } : undefined,
      orderBy: { group: 'asc' },
    });

    // key → value map
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });

    return NextResponse.json({ settings, map });
  } catch {
    return NextResponse.json({ error: 'Ayarlar yüklenemedi' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { updates }: { updates: Record<string, string> } = body;

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    }

    // Hangi gruplar güncelleniyor tespit et
    const keysBeingUpdated = Object.keys(updates);
    const isLogoUpdate = keysBeingUpdated.some((k) =>
      k.startsWith('logo') || k === 'favicon'
    );

    // Tüm güncellemeleri upsert et
    // Group'u key'e göre akıllıca belirle
    const results = await Promise.all(
      Object.entries(updates).map(([key, value]) => {
        let group = 'general';
        if (key.startsWith('logo') || key === 'favicon') group = 'logo';
        else if (['phone', 'phone_display', 'whatsapp', 'email', 'address', 'address_landmark', 'working_hours', 'whatsapp_message'].includes(key)) group = 'contact';
        else if (['meta_title', 'meta_desc', 'google_analytics', 'google_verification', 'seo.siteTitle', 'seo.siteDescription', 'seo.keywords', 'seo.googleVerification', 'seo.ogImage', 'seo.canonicalBase'].includes(key)) group = 'seo';
        else if (key.startsWith('social_')) group = 'social';

        return prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: {
            key,
            value,
            group,
            label: key,
            type: key.startsWith('logo') || key === 'favicon' || key.includes('image') ? 'image' : 'text',
          },
        });
      })
    );

    // Aktivite logu
    await prisma.activityLog.create({
      data: {
        action: 'settings_updated',
        target: Object.keys(updates).join(', '),
        detail: `${Object.keys(updates).length} ayar güncellendi`,
      },
    }).catch(() => {});

    // Cache temizle — site-settings tag'i ve ilgili sayfalar
    revalidateTag('site-settings', 'max');
    if (isLogoUpdate) {
      revalidatePath('/', 'layout'); // Tüm layout cache'i (logo değişince tüm sayfalar)
    }
    revalidatePath('/', 'page');
    revalidatePath('/hizmetler', 'page');
    revalidatePath('/hakkimizda', 'page');
    revalidatePath('/calismalarimiz', 'page');
    revalidatePath('/iletisim', 'page');

    return NextResponse.json({ success: true, updated: results.length });
  } catch (error) {
    console.error('[Settings POST]', error);
    return NextResponse.json({ error: 'Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.' }, { status: 500 });
  }
}
