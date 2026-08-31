import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/webp',
  'image/avif', 'image/svg+xml', 'image/x-icon', 'image/gif',
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function slugifyFilename(name: string): string {
  const ext = path.extname(name);
  const base = path.basename(name, ext)
    .toLowerCase()
    .replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-').replace(/^-|-$/g, '');
  return base + ext.toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400 });
    if (!ALLOWED_MIMES.includes(file.type)) return NextResponse.json({ error: 'Desteklenmeyen dosya türü.' }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'Dosya 10MB sınırını aşıyor.' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // SVG güvenlik kontrolü
    if (file.type === 'image/svg+xml') {
      const svgText = buffer.toString('utf8');
      if (/(<script|javascript:|on\w+\s*=)/i.test(svgText)) {
        return NextResponse.json({ error: 'Script içeren SVG yüklenemez.' }, { status: 400 });
      }
    }

    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const safeBase = slugifyFilename(file.name);
    const ext = path.extname(safeBase);
    const base = path.basename(safeBase, ext);
    const uniqueName = `${base}-${uniqueId}${ext}`;

    let url: string;

    const isVercel = !!process.env.BLOB_STORE_ID;

    if (isVercel) {
      // Production: Vercel Blob — SDK otomatik BLOB_STORE_ID + OIDC auth kullanır
      const { put } = await import('@vercel/blob');
      const blob = await put(`uploads/${year}/${month}/${uniqueName}`, buffer, {
        access: 'public',
        contentType: file.type,
        // token geçmiyoruz — SDK BLOB_STORE_ID + VERCEL_OIDC_TOKEN ile otomatik auth yapar
      });
      url = blob.url;
    } else {
      // Development: yerel dosya sistemi
      const { writeFile, mkdir } = await import('fs/promises');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', year, month);
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);
      url = `/uploads/${year}/${month}/${uniqueName}`;
    }

    // Boyutları al
    let width: number | null = null;
    let height: number | null = null;
    try {
      const sharp = await import('sharp').catch(() => null);
      if (sharp && file.type !== 'image/svg+xml') {
        const meta = await sharp.default(buffer).metadata();
        width = meta.width ?? null;
        height = meta.height ?? null;
      }
    } catch { /* sharp yok */ }

    const { prisma } = await import('@/lib/prisma');
    const media = await prisma.media.create({
      data: {
        filename: uniqueName,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        width,
        height,
        url,
        folder: `${year}/${month}`,
      },
    });

    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error('[Upload API]:', error);
    const msg = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ error: `Yükleme hatası: ${msg}` }, { status: 500 });
  }
}
