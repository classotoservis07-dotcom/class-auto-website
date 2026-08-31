import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';
import { prisma } from '@/lib/prisma';
import { FAQ_ITEMS } from '@/lib/config';
import { unstable_cache } from 'next/cache';

export const metadata: Metadata = generatePageMetadata({
  title: 'Sık Sorulan Sorular | CLASS AUTO Antalya',
  description: 'CLASS AUTO oto servis hakkında merak edilen sorular ve cevapları. Randevu, hizmet süresi, fiyatlandırma ve daha fazlası.',
  slug: 'sss',
});

const getDbFaqs = unstable_cache(
  async () => prisma.fAQ.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
  ['sss-faqs'],
  { tags: ['faqs'], revalidate: 3600 }
);

export default async function SSSPage() {
  const dbFaqs = await getDbFaqs().catch(() => []);
  const items = dbFaqs.length > 0
    ? dbFaqs.map((f) => ({ q: f.question, a: f.answer }))
    : FAQ_ITEMS;

  return (
    <>
      {/* ── Sayfa başlığı ── */}
      <section style={{ paddingTop: '130px', paddingBottom: '48px', background: '#F5F6F7', borderBottom: '1px solid #E2E6EA' }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#66717C', listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
              <li><Link href="/" style={{ color: '#66717C', textDecoration: 'none' }}>Ana Sayfa</Link></li>
              <li aria-hidden>/</li>
              <li style={{ color: '#1D252D', fontWeight: 600 }}>Sık Sorulan Sorular</li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: 'clamp(1.75rem,4vw,2.75rem)', fontWeight: 700, color: '#1D252D', marginBottom: '12px' }}>
            Sık Sorulan <span style={{ color: '#E30613' }}>Sorular</span>
          </h1>
          <p style={{ color: '#66717C', fontSize: '1.0625rem', maxWidth: '600px', margin: 0 }}>
            Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz.
          </p>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section style={{ background: '#FFFFFF', padding: '4rem 0' }}>
        <div className="container-site" style={{ maxWidth: '760px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {items.map((item, i) => (
              <details
                key={i}
                style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '10px', overflow: 'hidden' }}
                className="faq-item"
              >
                <summary style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '16px', padding: '16px 20px', cursor: 'pointer', listStyle: 'none',
                  color: '#1D252D', fontWeight: 600, fontSize: '15px',
                }}>
                  {item.q}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </summary>
                <div style={{ padding: '0 20px 16px', borderTop: '1px solid #E2E6EA' }}>
                  <p style={{ paddingTop: '12px', color: '#66717C', fontSize: '14px', lineHeight: 1.75 }}>{item.a}</p>
                </div>
              </details>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: '3rem', background: '#F5F6F7', border: '1px solid #E2E6EA', borderRadius: '14px', padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '1.35rem', fontWeight: 700, color: '#1D252D', marginBottom: '8px' }}>
              Sorunuzu Bulamadınız mı?
            </h2>
            <p style={{ color: '#66717C', fontSize: '14px', marginBottom: '20px' }}>
              Bize doğrudan ulaşın, yardımcı olalım.
            </p>
            <Link href="/iletisim" className="btn-primary">İletişime Geç</Link>
          </div>
        </div>
        <style>{`
          .faq-item[open] summary svg { transform: rotate(45deg); }
          .faq-item summary svg { transition: transform 0.2s ease; }
          .faq-item[open] { border-color: rgba(227,6,19,0.2); }
        `}</style>
      </section>
    </>
  );
}
