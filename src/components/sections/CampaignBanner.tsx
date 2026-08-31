/**
 * CampaignBanner — Server Component
 *
 * Fetches the latest active, published, showOnHome campaign from DB.
 * Returns null if none found.
 * Cached with tag 'campaigns', revalidates every hour.
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

  // Date format — only if endDate is set
  const endDateStr = campaign.endDate
    ? new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(campaign.endDate))
    : null;

  return (
    <section
      aria-label="Güncel Kampanya"
      style={{ background: bgColor }}
    >
      <div
        className="container-site"
        style={{ paddingBlock: '3rem' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: hasImage ? '1fr 1fr' : '1fr',
            gap: '2rem',
            alignItems: 'center',
          }}
          className="campaign-grid"
        >
          {/* Left: text content */}
          <div>
            {/* Label */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(227,6,19,0.15)',
                border: '1px solid rgba(227,6,19,0.35)',
                borderRadius: '999px',
                padding: '4px 12px',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#E30613',
                  display: 'inline-block',
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  color: '#E30613',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Güncel Kampanya
              </span>
            </div>

            <h2
              style={{
                color: '#F5F6F7',
                fontFamily: 'Oswald, Arial Narrow, sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: '12px',
              }}
            >
              {campaign.title}
            </h2>

            {campaign.description && (
              <p
                style={{
                  color: 'rgba(245,246,247,0.75)',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                  maxWidth: '480px',
                }}
              >
                {campaign.description}
              </p>
            )}

            {endDateStr && (
              <p style={{ color: 'rgba(245,246,247,0.55)', fontSize: '13px', marginBottom: '20px' }}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Son geçerlilik tarihi: {endDateStr}
              </p>
            )}

            <Link
              href={buttonHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#E30613',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9375rem',
                padding: '0.75rem 1.75rem',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
            >
              {buttonLabel}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>

            {campaign.terms && (
              <p style={{ color: 'rgba(245,246,247,0.4)', fontSize: '11px', marginTop: '12px', maxWidth: '400px' }}>
                * {campaign.terms}
              </p>
            )}
          </div>

          {/* Right: image */}
          {hasImage && imgSrc && (
            <div
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '16/9',
              }}
            >
              <Image
                src={imgSrc}
                alt={campaign.title}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>
          )}
        </div>
      </div>

      {/* Responsive grid — mobile stacks */}
      <style>{`
        @media (max-width: 767px) {
          .campaign-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
