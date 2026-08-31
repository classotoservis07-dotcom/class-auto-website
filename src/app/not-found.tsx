import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#111315] px-4">
      <div className="text-center max-w-xl">
        {/* 404 büyük rakam */}
        <div
          className="text-[160px] font-bold leading-none select-none"
          style={{
            fontFamily: 'Oswald, Arial Narrow, sans-serif',
            color: 'transparent',
            WebkitTextStroke: '2px #2A2F35',
          }}
          aria-hidden="true"
        >
          404
        </div>

        <div className="mt-2 mb-6">
          <div className="w-16 h-0.5 bg-[#C8281E] mx-auto mb-6" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-[#F4F4F4] mb-3" style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif' }}>
            Sayfa Bulunamadı
          </h1>
          <p className="text-[#AEB3B8] leading-relaxed">
            Aradığınız sayfa mevcut değil ya da taşınmış olabilir. Ana sayfaya dönerek devam edebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Ana Sayfa
          </Link>
          <Link href="/hizmetler" className="btn-secondary">
            Hizmetlerimiz
          </Link>
          <Link href="/iletisim" className="btn-secondary">
            İletişim
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-[#2A2F35]">
          <p className="text-[#6B7280] text-sm">
            {SITE_CONFIG.brand.name} — {SITE_CONFIG.address.full}
          </p>
        </div>
      </div>
    </section>
  );
}
