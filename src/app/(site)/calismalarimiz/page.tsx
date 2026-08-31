import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import WorksGallery from '@/components/sections/WorksGallery';

export const metadata: Metadata = generatePageMetadata({
  title: 'Çalışmalarımız — Oto Servis Galerisi | CLASS AUTO',
  description: 'CLASS AUTO oto servisinin gerçekleştirdiği kaporta, boya, mekanik ve onarım çalışmalarından örnekler. Gerçek araçlar, gerçek çözümler.',
  slug: 'calismalarimiz',
});

const getWorks = unstable_cache(
  async () =>
    prisma.work.findMany({
      where: { status: 'published' },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    }),
  ['all-works'],
  { tags: ['works'], revalidate: 3600 }
);

export default async function WorksPage() {
  const works = await getWorks().catch(() => []);

  return (
    <>
      {/* ── Sayfa Başlığı ── */}
      <section style={{ paddingTop: '130px', paddingBottom: '48px', background: '#F5F6F7', borderBottom: '1px solid #E2E6EA' }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#66717C', listStyle: 'none', padding: 0, margin: '0 0 14px' }}>
              <li><Link href="/" style={{ color: '#66717C', textDecoration: 'none' }}>Ana Sayfa</Link></li>
              <li aria-hidden>/</li>
              <li style={{ color: '#1D252D', fontWeight: 600 }}>Çalışmalarımız</li>
            </ol>
          </nav>
          <h1 style={{
            fontFamily: 'Oswald, Arial Narrow, sans-serif',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 700, color: '#1D252D', marginBottom: '12px',
          }}>
            <span style={{ color: '#E30613' }}>Gerçek</span> Çalışmalarımız
          </h1>
          <p style={{ color: '#66717C', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.7, margin: 0 }}>
            Servisimizde tamamladığımız araç onarım ve bakım çalışmalarından örnekler.
            Fotoğrafa tıklayarak büyütebilirsiniz.
          </p>

          {works.length > 0 && (
            <div style={{ marginTop: '20px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ color: '#66717C', fontSize: '13px' }}>{works.length} tamamlanmış çalışma</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Galeri ── */}
      <section style={{ background: '#FFFFFF', padding: '3rem 0 5rem' }}>
        <div className="container-site">
          {works.length > 0 ? (
            <WorksGallery works={works} />
          ) : (
            /* Boş durum */
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: '#F5F6F7', border: '2px solid #E2E6EA',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" aria-hidden="true">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '1.5rem', color: '#1D252D', marginBottom: '10px' }}>
                Çalışmalar Yakında Eklenecek
              </h2>
              <p style={{ color: '#66717C', marginBottom: '28px', fontSize: '15px' }}>
                Yönetim panelinden gerçek araç fotoğrafları eklendiğinde burada görüntülenecektir.
              </p>
              <Link href="/iletisim" className="btn-primary">Randevu Al</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#F5F6F7', borderTop: '1px solid #E2E6EA', padding: '4rem 0' }}>
        <div className="container-site" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'Oswald, Arial Narrow, sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700, color: '#1D252D', marginBottom: '12px',
          }}>
            Aracınız için Profesyonel Servis
          </h2>
          <p style={{ color: '#66717C', marginBottom: '28px', fontSize: '15px' }}>
            Fotoğraflarda gördüğünüz kalitede hizmet almak için randevu alın.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/iletisim" className="btn-primary">Randevu Al</Link>
            <Link href="/hizmetler" className="btn-secondary" style={{ borderColor: '#E2E6EA', color: '#1D252D' }}>
              Hizmetlerimiz
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
