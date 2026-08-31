import { NextRequest, NextResponse } from 'next/server';
import { revalidateSite } from '@/lib/revalidate';

async function getPrisma() {
  const { prisma } = await import('@/lib/prisma');
  return prisma;
}

// GET: public-friendly — returns active, published, showOnHome campaigns
// Pass ?all=1 to get all campaigns (admin use)
export async function GET(req: NextRequest) {
  const prisma = await getPrisma();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === '1';

  if (all) {
    // Admin: return all campaigns
    const campaigns = await prisma.campaign.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ campaigns });
  }

  // Public: active, published, showOnHome, date-range valid
  const now = new Date();
  const campaigns = await prisma.campaign.findMany({
    where: {
      isActive: true,
      status: 'published',
      showOnHome: true,
      OR: [
        { endDate: null },
        { endDate: { gt: now } },
      ],
      AND: [
        {
          OR: [
            { startDate: null },
            { startDate: { lte: now } },
          ],
        },
      ],
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json({ campaigns });
}

export async function POST(req: NextRequest) {
  const prisma = await getPrisma();
  const body = await req.json();
  const {
    id, title, description, badge,
    buttonText, buttonUrl,
    ctaText, ctaUrl,
    startDate, endDate,
    isActive, showOnHome,
    status, bannerColor,
    terms, relatedService, landingPageUrl,
    sortOrder, image, imageUrl,
  } = body;

  const data = {
    title: String(title),
    description: description || null,
    badge: badge || null,
    buttonText: buttonText || null,
    buttonUrl: buttonUrl || null,
    ctaText: ctaText || null,
    ctaUrl: ctaUrl || null,
    image: image || null,
    imageUrl: imageUrl || null,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
    isActive: Boolean(isActive),
    showOnHome: Boolean(showOnHome),
    status: status || 'draft',
    bannerColor: bannerColor || null,
    terms: terms || null,
    relatedService: relatedService || null,
    landingPageUrl: landingPageUrl || null,
    sortOrder: Number(sortOrder ?? 0),
  };

  if (!data.title?.trim()) {
    return NextResponse.json({ error: 'Başlık zorunludur.' }, { status: 400 });
  }

  if (id) {
    const c = await prisma.campaign.update({ where: { id: Number(id) }, data });
    revalidateSite('campaigns');
    return NextResponse.json({ success: true, campaign: c });
  } else {
    const c = await prisma.campaign.create({ data });
    revalidateSite('campaigns');
    return NextResponse.json({ success: true, campaign: c });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prisma = await getPrisma();
  await prisma.campaign.delete({ where: { id: Number(searchParams.get('id')) } });
  revalidateSite('campaigns');
  return NextResponse.json({ success: true });
}
