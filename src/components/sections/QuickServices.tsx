/**
 * QuickServices — Server Component (static content, no DB needed)
 *
 * 8 service cards linking to service pages.
 * Grid: 4 cols desktop, 2 cols mobile.
 */

const QUICK_SERVICES = [
  {
    slug: '/hizmetler/periyodik-bakim',
    name: 'Periyodik Bakım',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    slug: '/hizmetler/mekanik-bakim',
    name: 'Mekanik Onarım',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
  {
    slug: '/hizmetler/oto-elektrik',
    name: 'Oto Elektrik',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    slug: '/hizmetler/ariza-tespit',
    name: 'Arıza Tespit',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    slug: '/hizmetler/kaporta-boya',
    name: 'Kaporta ve Boya',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m19 11-8-8-8.5 8.5a5.5 5.5 0 0 0 7.78 7.78L19 11z"/>
        <path d="m19 11 2 2a2.5 2.5 0 0 1 0 3.5"/>
        <path d="M20.5 16.5c.5.5.5 1 .5 1.5a2 2 0 0 1-2 2c-.5 0-1-.25-1.5-.5"/>
      </svg>
    ),
  },
  {
    slug: '/hizmetler/boyasiz-gocuk-duzeltme',
    name: 'Boyasız Göçük',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    slug: '/hizmetler/klima-bakimi',
    name: 'Klima Bakımı',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
        <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
        <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
      </svg>
    ),
  },
  {
    slug: '/hizmetler/oto-lastik',
    name: 'Lastik ve Balans',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    ),
  },
] as const;

export default function QuickServices() {
  return (
    <section
      aria-labelledby="quick-services-heading"
      style={{ background: '#FFFFFF', paddingBlock: '4rem' }}
    >
      <div className="container-site">
        <h2
          id="quick-services-heading"
          style={{
            textAlign: 'center',
            fontFamily: 'Oswald, Arial Narrow, sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: '#1D252D',
            marginBottom: '2.5rem',
          }}
        >
          Aracınız İçin Hangi Hizmete İhtiyacınız Var?
        </h2>

        <div
          style={{
            display: 'grid',
            gap: '1rem',
          }}
          className="quick-services-grid"
        >
          {QUICK_SERVICES.map((svc) => (
            <a
              key={svc.slug}
              href={svc.slug}
              aria-label={svc.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '1.5rem 1rem',
                background: '#F5F6F7',
                border: '1px solid #E2E6EA',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#1D252D',
                transition: 'border-color 0.2s ease, background 0.2s ease, transform 0.2s ease',
                textAlign: 'center',
              }}
              className="quick-service-card"
            >
              {/* Icon */}
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'rgba(227,6,19,0.08)',
                  border: '1px solid rgba(227,6,19,0.15)',
                  color: '#E30613',
                }}
              >
                {svc.icon}
              </span>

              {/* Service name */}
              <span
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#1D252D',
                  lineHeight: 1.3,
                }}
              >
                {svc.name}
              </span>

              {/* Arrow */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E30613"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .quick-services-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 1023px) {
          .quick-services-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        @media (max-width: 767px) {
          .quick-services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .quick-service-card:hover {
          border-color: rgba(227,6,19,0.3) !important;
          background: rgba(227,6,19,0.04) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
