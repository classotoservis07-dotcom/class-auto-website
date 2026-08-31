import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? 1);
    const search = searchParams.get('search') ?? '';
    const mimeFilter = searchParams.get('mime') ?? '';
    const perPage = 24;
    const skip = (page - 1) * perPage;
    
    const { prisma } = await import('@/lib/prisma');
    
    const where = {
      AND: [
        search ? {
          OR: [
            { filename: { contains: search } },
            { originalName: { contains: search } },
            { altText: { contains: search } },
          ],
        } : {},
        mimeFilter ? { mimeType: { contains: mimeFilter } } : {},
      ],
    };
    
    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPage,
      }),
      prisma.media.count({ where }),
    ]);
    
    return NextResponse.json({ items, total, page, perPage, totalPages: Math.ceil(total / perPage) });
  } catch (error) {
    console.error('[Media GET]:', error);
    return NextResponse.json({ error: 'Medya listesi alınamadı.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'ID gerekli.' }, { status: 400 });
    
    const { prisma } = await import('@/lib/prisma');
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return NextResponse.json({ error: 'Medya bulunamadı.' }, { status: 404 });
    
    // Delete file from disk
    const { unlink } = await import('fs/promises');
    const { default: path } = await import('path');
    const filePath = path.join(process.cwd(), 'public', media.url);
    await unlink(filePath).catch(() => {}); // ignore if file already deleted
    
    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Media DELETE]:', error);
    return NextResponse.json({ error: 'Medya silinemedi.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, altText, title, description } = body;
    if (!id) return NextResponse.json({ error: 'ID gerekli.' }, { status: 400 });
    
    const { prisma } = await import('@/lib/prisma');
    const media = await prisma.media.update({
      where: { id: Number(id) },
      data: {
        altText: altText ?? undefined,
        title: title ?? undefined,
        description: description ?? undefined,
      },
    });
    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error('[Media PATCH]:', error);
    return NextResponse.json({ error: 'Medya güncellenemedi.' }, { status: 500 });
  }
}
