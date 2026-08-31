import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/lib/site-settings';
import { unstable_cache } from 'next/cache';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import UTMCapture from './UTMCapture';

// ── Cache'li LP sorgusu ───────────────────────────────────────────────────────

function getLandingPage(slug: string) {
  return unstable_cache(
    () => prisma.landingPage.findUnique({ where: { slug, isActive: true } }),
    [`lp-${slug}`],
    { tags: ['landing-pages'], revalidate: 3600 }
  )();
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lp = await getLandingPage(slug).catch(() => null);
  if (!lp) return { title: 'CLASS AUTO', robots: { index: false, follow: false } };
  return {
    title: lp.metaTitle || lp.title,
    description: lp.metaDesc || lp.headline,
    robots: { index: false, follow: false }, // landing pages — no-index by default
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const [lp, settings] = await Promise.all([
    getLandingPage(slug).catch(() => null),
    getSiteSettings().catch(() => null),
  ]);

  if (!lp) notFound();

  const hasPhone    = Boolean(settings?.phone?.trim());
  const hasWhatsApp = Boolean(settings?.whatsapp?.trim());
  const waNum       = settings?.whatsapp?.replace(/\D/g, '') || '';
  const waMsg       = encodeURIComponent(`Merhaba, ${lp.title} hakkında bilgi almak istiyorum.`);
  const waHref      = hasWhatsApp ? `https://wa.me/${waNum}?text=${waMsg}` : '/iletisim';

  return (
    <>
      {/* UTM / GCLID capture (client component) */}
      <UTMCapture />

      {/* ── Simplified Header ──────────────────────────────────────────── */}
      <header style={{ background: '#11171D', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container-site" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', color: '#F5F6F7', fontSize: '1.25rem', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em' }}>
            CLASS <span style={{ color: '#E30613' }}>AUTO</span>
          </Link>
          {hasPhone && (
            <a
              href={`tel:${settings!.phone.replace(/\s/g, '')}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E30613', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none' }}
              aria-label="Hemen Ara"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Ara
            </a>
          )}
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      {lp.showHero && (
        <section style={{ background: 'linear-gradient(160deg, #11171D, #202A34)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
          {lp.heroImage && (
            <div style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
              <Image src={lp.heroImage} alt="" fill style={{ objectFit: 'cover', opacity: 0.25 }} unoptimized />
            </div>
          )}
          <div className="container-site" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(227,6,19,0.12)', border: '1px solid rgba(227,6,19,0.3)', borderRadius: '999px', padding: '4px 14px', marginBottom: '20px' }}>
              <span style={{ color: '#E30613', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>CLASS AUTO — Antalya</span>
            </div>
            <h1 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: 'clamp(1.75rem,5vw,3rem)', fontWeight: 700, color: '#F5F6F7', lineHeight: 1.15, marginBottom: '20px' }}>
              {lp.headline}
            </h1>
            {lp.content && (
              <p style={{ color: '#9CA3AF', fontSize: '1.125rem', maxWidth: '560px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
                {lp.content}
              </p>
            )}
            {/* Primary CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              {hasWhatsApp && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#25D366', color: '#fff', fontWeight: 700, fontSize: '1rem', padding: '0.85rem 2rem', borderRadius: '10px', textDecoration: 'none' }}
                  aria-label="WhatsApp ile Randevu Al"
                >
                  WhatsApp&apos;tan Randevu Al
                </a>
              )}
              {hasPhone && (
                <a
                  href={`tel:${settings!.phone.replace(/\s/g, '')}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#E30613', color: '#fff', fontWeight: 700, fontSize: '1rem', padding: '0.85rem 2rem', borderRadius: '10px', textDecoration: 'none' }}
                  aria-label="Hemen Ara"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Hemen Ara
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Trust elements ───────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', paddingBlock: '3rem', borderBottom: '1px solid #E2E6EA' }}>
        <div className="container-site">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', textAlign: 'center' }} className="lp-trust-grid">
            {[
              { icon: '✓', text: 'Tüm Markalara Servis' },
              { icon: '✓', text: 'İşlem Öncesi Bilgilendirme' },
              { icon: '✓', text: 'Modern Ekipmanlar' },
              { icon: '✓', text: 'Kolay Randevu' },
            ].map((t) => (
              <div key={t.text} style={{ padding: '1.25rem', background: '#F5F6F7', borderRadius: '10px', border: '1px solid #E2E6EA' }}>
                <div style={{ color: '#E30613', fontWeight: 800, fontSize: '1.25rem', marginBottom: '6px' }}>{t.icon}</div>
                <p style={{ color: '#1D252D', fontSize: '13px', fontWeight: 600 }}>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Contact ───────────────────────────────────────────── */}
      <section style={{ background: '#F5F6F7', paddingBlock: '4rem' }}>
        <div className="container-site" style={{ maxWidth: '640px' }}>
          <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#1D252D', textAlign: 'center', marginBottom: '2rem' }}>
            Hemen İletişime Geçin
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hasPhone && (
              <a
                href={`tel:${settings!.phone.replace(/\s/g, '')}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#E30613', color: '#fff', fontWeight: 700, fontSize: '1.125rem', padding: '1rem 2rem', borderRadius: '12px', textDecoration: 'none' }}
                aria-label="Hemen Ara"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {settings!.phoneDisplay || settings!.phone}
              </a>
            )}
            {hasWhatsApp && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#25D366', color: '#fff', fontWeight: 700, fontSize: '1.125rem', padding: '1rem 2rem', borderRadius: '12px', textDecoration: 'none' }}
                aria-label="WhatsApp ile Yaz"
              >
                WhatsApp ile Yaz
              </a>
            )}
            <Link
              href="/iletisim"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#202A34', color: '#fff', fontWeight: 600, fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: '12px', textDecoration: 'none' }}
            >
              İletişim Formu
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .lp-trust-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 767px) { .lp-trust-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </>
  );
}
