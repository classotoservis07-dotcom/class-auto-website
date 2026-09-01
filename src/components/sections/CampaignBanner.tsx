/**
 * CampaignBanner — Server Component
 *
 * Fetches the latest active, published, showOnHome campaign from DB.
 * Returns null if none found.
 * Cached with tag 'campaigns', revalidates every hour.
 * Image fully covers the banner as background; price overlay stays bottom-right.
 */

import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import Image from 'next/image';

// Cache'li kampanya sorgusu
const getActiveCampaign = unstable_cache(
  async () => {
    const now = new Date();
    return prisma.campaign.findFirst({
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
      orderBy: { createdAt: 'desc' },
    });
  },
  ['active-campaign'],
  { tags: ['campaigns'], revalidate: 3600 }
);

export default async function CampaignBanner() {
  let campaign = null;
  try {
    campaign = await getActiveCampaign();
  } catch {
    return null;
  }

  if (!campaign) return null;

  const bgColor = campaign.bannerColor || '#202A34';
  const buttonHref = campaign.buttonUrl || campaign.ctaUrl || campaign.landingPageUrl || '/iletisim';
  const buttonLabel = campaign.buttonText || campaign.ctaText || 'Kampanyayı İncele';
  const hasImage = Boolean(campaign.imageUrl || campaign.image);
  const imgSrc = campaign.imageUrl || campaign.image || '';

  const endDateStr = campaign.endDate
    ? new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(campaign.endDate))
    : null;

  return (
    <section
      aria-label="Güncel Kampanya"
      style={{ position: 'relative', overflow: 'hidden', minHeight: '340px', background: bgColor }}
    >
      {/* === Tam kaplayan arka plan görseli === */}
      {hasImage && imgSrc && (
        <>
          <Image
            src={imgSrc}
            alt={campaign.title}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            unoptimized
            priority
          />
          {/* Koyu gradient — sol taraf okunaklı, sağ açık */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(20,25,30,0.92) 0%, rgba(20,25,30,0.75) 50%, rgba(20,25,30,0.35) 100%)',
          }} />
        </>
      )}

      {/* === İçerik (görsel üzerinde) === */}
      <div
        className="container-site"
        style={{ position: 'relative', zIndex: 10, paddingBlock: '3.5rem' }}
      >
        <div style={{ maxWidth: '560px' }}>

          {/* Yeşil rozet */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(22,163,74,0.18)',
            border: '1px solid rgba(22,163,74,0.45)',
            borderRadius: '999px',
            padding: '4px 12px',
            marginBottom: '16px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} aria-hidden="true" />
            <span style={{ color: '#4ADE80', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Güncel Kampanya
            </span>
          </div>

          {/* Başlık */}
          <h2 style={{
            color: '#F5F6F7',
            fontFamily: 'Oswald, Arial Narrow, sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: '12px',
          }}>
            {campaign.title}
          </h2>

          {/* Açıklama */}
          {campaign.description && (
            <p style={{ color: 'rgba(245,246,247,0.8)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '16px' }}>
              {campaign.description}
            </p>
          )}

          {/* Tarih */}
          {endDateStr && (
            <p style={{ color: 'rgba(245,246,247,0.6)', fontSize: '13px', marginBottom: '20px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Son geçerlilik tarihi: {endDateStr}
            </p>
          )}

          {/* CTA butonu */}
          <Link
            href={buttonHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#22C55E',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9375rem',
              padding: '0.75rem 1.75rem',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            {buttonLabel}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>

          {/* Koşullar */}
          {campaign.terms && (
            <p style={{ color: 'rgba(245,246,247,0.4)', fontSize: '11px', marginTop: '12px' }}>
              * {campaign.terms}
            </p>
          )}
        </div>
      </div>

      {/* === Fiyat overlay — sağ alt köşe === */}
      {campaign.badge && (
        <div 
          className="campaign-badge-overlay"
          style={{
          position: 'absolute',
          bottom: '24px',
          right: '32px',
          zIndex: 20,
        }}>
          <div style={{
            background: 'rgba(22,163,74,0.92)',
            border: '2px solid #4ADE80',
            borderRadius: '10px',
            padding: '12px 24px',
            textAlign: 'center',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 4px 24px rgba(22,163,74,0.35)',
          }}>
            <span style={{
              color: '#fff',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              fontWeight: 800,
              fontFamily: 'Oswald, Arial Narrow, sans-serif',
              letterSpacing: '0.03em',
              display: 'block',
              whiteSpace: 'nowrap',
            }}>
              {campaign.badge}
            </span>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .campaign-badge-overlay {
            right: 16px !important;
            bottom: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
