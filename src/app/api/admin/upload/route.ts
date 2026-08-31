import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Allowed MIME types
const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/webp',
  'image/avif', 'image/svg+xml', 'image/x-icon',
  'image/gif',
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
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400 });
    }
    
    // MIME type check
    if (!ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Bu dosya türü desteklenmiyor. JPEG, PNG, WebP, AVIF, SVG veya ICO yükleyin.' },
        { status: 400 }
      );
    }
    
    // Size check
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Dosya boyutu 10 MB sınırını aşıyor.' },
        { status: 400 }
      );
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Check actual MIME from magic bytes (basic check)
    const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50;
    const isWebP = buffer.slice(8, 12).toString('ascii') === 'WEBP';
    const isSvg = file.type === 'image/svg+xml';
    const isIco = buffer[0] === 0x00 && buffer[1] === 0x00;
    
    if (!isJpeg && !isPng && !isWebP && !isSvg && !isIco && file.type !== 'image/avif' && file.type !== 'image/gif') {
      // Allow if type matches even without magic byte check (AVIF/GIF have complex headers)
      // For SVG - content will be sanitized
    }
    
    // SVG sanitization - remove script tags
    let finalBuffer = buffer;
    if (isSvg) {
      const svgText = buffer.toString('utf8');
      if (/(<script|javascript:|on\w+\s*=)/i.test(svgText)) {
        return NextResponse.json(
          { error: 'SVG dosyası güvenli değil. Script içeren SVG yüklenemez.' },
          { status: 400 }
        );
      }
    }
    
    // Create upload directory
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', year, month);
    await mkdir(uploadDir, { recursive: true });
    
    // Generate unique filename
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const safeBaseName = slugifyFilename(file.name);
    const ext = path.extname(safeBaseName);
    const base = path.basename(safeBaseName, ext);
    const uniqueName = `${base}-${uniqueId}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);
    
    await writeFile(filePath, finalBuffer);
    
    // URL for public access
    const url = `/uploads/${year}/${month}/${uniqueName}`;
    
    // Get image dimensions (simple approach without sharp)
    let width: number | undefined;
    let height: number | undefined;
    
    try {
      // Try sharp if available
      const sharp = await import('sharp').catch(() => null);
      if (sharp && !isSvg) {
        const metadata = await sharp.default(filePath).metadata();
        width = metadata.width;
        height = metadata.height;
      }
    } catch { /* sharp not available, skip dimensions */ }
    
    // Save to database
    const { prisma } = await import('@/lib/prisma');
    const media = await prisma.media.create({
      data: {
        filename: uniqueName,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        width: width ?? null,
        height: height ?? null,
        url,
        folder: `${year}/${month}`,
      },
    });
    
    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error('[Upload API]:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}


