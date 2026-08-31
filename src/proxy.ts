import { NextRequest, NextResponse } from 'next/server';

// Next.js 16 proxy (eski: middleware)
// Yönlendirme mantığı burada - iron-session layout.tsx'te çalışıyor
export function proxy(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
