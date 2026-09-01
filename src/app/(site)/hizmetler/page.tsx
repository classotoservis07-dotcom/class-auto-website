import type { Metadata } from 'next';
import Link from 'next/link';
import { SERVICES } from '@/lib/config';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hizmetlerimiz — Oto Servis | CLASS AUTO Antalya',
  description:
    "CLASS AUTO olarak Antalya Muratpaşa'da sunduğumuz tüm oto servis hizmetleri: mekanik bakım, oto elektrik, kaporta-boya, klima, lastik, boyasız göçük düzeltme ve arıza tespiti.",
  slug: 'hizmetler',
  keywords: ['Antalya oto servis hizmetleri', 'mekanik bakım Antalya', 'kaporta boya Antalya'],
});

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  Wrench: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>),
  Zap: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
  PaintBucket: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m19 11-8-8-8.5 8.5a5.5 5.5 0 0 0 7.78 7.78L19 11z"/><path d="m19 11 2 2a2.5 2.5 0 0 1 0 3.5"/></svg>),
  CircleDot: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>),
  Wind: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>),
  Circle: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>),
  Search: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>),
};

import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

const getServices = unstable_cache(
  async () => prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  }),
  ['services-list'],
  { tags: ['services'], revalidate: 3600 }
);

export default async function ServicesPage() {
  const dbServices = await getServices();
  const services = dbServices.length > 0 ? dbServices : SERVICES;

  return (
    <>
      {/* ── Sayfa başlığı ── */}
      <section style={{ paddingTop: '130px', paddingBottom: '48px', background: '#F5F6F7', borderBottom: '1px solid #E2E6EA' }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#66717C', listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
              <li><Link href="/" style={{ color: '#66717C', textDecoration: 'none' }}>Ana Sayfa</Link></li>
              <li aria-hidden>/</li>
              <li style={{ color: '#1D252D', fontWeight: 600 }}>Hizmetlerimiz</li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: 'clamp(1.75rem,4vw,2.75rem)', fontWeight: 700, color: '#1D252D', marginBottom: '12px' }}>
            <span style={{ color: '#E30613' }}>Profesyonel</span> Oto Servis Hizmetleri
          </h1>
          <p style={{ color: '#66717C', fontSize: '1.0625rem', maxWidth: '600px', margin: 0 }}>
            Antalya Muratpaşa Güzeloba&apos;da aracınızın tüm ihtiyaçlarını karşılayan kapsamlı servis hizmetleri.
          </p>
        </div>
      </section>

      {/* ── Hizmet kartları ── */}
      <section style={{ background: '#FFFFFF', padding: '4rem 0' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const href = service.slug.startsWith('/') ? service.slug : `/hizmetler/${service.slug}`;
              return (
              <Link
                key={service.id}
                href={href}
                style={{
                  display: 'block',
                  background: '#FFFFFF',
                  border: '1px solid #E2E6EA',
                  borderRadius: '14px',
                  padding: '28px',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                  color: '#1D252D',
                }}
                className="svc-card"
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(227,6,19,0.07)', border: '1px solid rgba(227,6,19,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E30613', marginBottom: '18px' }}>
                  {SERVICE_ICONS[service.icon || 'Wrench'] || SERVICE_ICONS['Wrench']}
                </div>
                <h2 style={{ color: '#1D252D', fontWeight: 700, fontSize: '17px', marginBottom: '10px', fontFamily: 'Oswald, Arial Narrow, sans-serif' }}>
                  {service.title}
                </h2>
                <p style={{ color: '#66717C', fontSize: '14px', lineHeight: 1.65, marginBottom: '18px' }}>
                  {'shortDesc' in service ? service.shortDesc : service.description}
                </p>
                <span style={{ color: '#E30613', fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Detaylı Bilgi Al
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </Link>
            )})}
          </div>
          <style>{`.svc-card:hover { border-color: rgba(227,6,19,0.3) !important; transform: translateY(-3px); box-shadow: 0 10px 28px rgba(227,6,19,0.07); }`}</style>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#F5F6F7', borderTop: '1px solid #E2E6EA', padding: '4rem 0' }}>
        <div className="container-site" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700, color: '#1D252D', marginBottom: '12px' }}>
            Aradığınız hizmeti bulamadınız mı?
          </h2>
          <p style={{ color: '#66717C', marginBottom: '24px' }}>Tüm araç marka ve modellerine servis veriyoruz. Bizimle iletişime geçin.</p>
          <Link href="/iletisim" className="btn-primary">İletişime Geç</Link>
        </div>
      </section>
    </>
  );
}
