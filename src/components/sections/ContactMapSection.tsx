/**
 * ContactMapSection — Server Component
 *
 * Section id="iletisim-harita" — scroll target for floating button.
 * Left: contact info card (antrasit bg)
 * Right: lazy-loaded Google Maps embed
 * Desktop: 2 cols | Mobile: stacked
 */

import { getSiteSettings } from '@/lib/site-settings';
import MapEmbed from './MapEmbed';

export default async function ContactMapSection() {
  const s = await getSiteSettings();

  const hasPhone = Boolean(s.phone?.trim());
  const hasWhatsApp = Boolean(s.whatsapp?.trim());

  const waNum = s.whatsapp?.replace(/\D/g, '') || '';
  const waHref = hasWhatsApp
    ? `https://wa.me/${waNum}?text=${encodeURIComponent(s.whatsappMessage || 'Merhaba, randevu almak istiyorum.')}`
    : '/iletisim';

  const directionsUrl =
    s.mapDirectionsUrl ||
    'https://www.google.com/maps/search/CLASS+AUTO+Oto+Servis+Güzeloba+Havaalanı+Caddesi+Antalya';

  return (
    <section
      id="iletisim-harita"
      aria-labelledby="contact-map-heading"
      style={{
        background: '#FFFFFF',
        paddingBlock: '5rem',
        scrollMarginTop: '120px',
      }}
    >
      <div className="container-site">
        <h2
          id="contact-map-heading"
          style={{
            fontFamily: 'Oswald, Arial Narrow, sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: '#1D252D',
            marginBottom: '2.5rem',
            textAlign: 'center',
          }}
        >
          CLASS AUTO İletişim ve Yol Tarifi
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="contact-map-grid"
        >
          {/* ── Left: Info Card ── */}
          <div
            style={{
              background: '#202A34',
              borderRadius: '16px',
              padding: '2rem',
              color: '#F5F6F7',
            }}
          >
            {/* Brand */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p
                style={{
                  fontFamily: 'Oswald, Arial Narrow, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#E30613',
                  letterSpacing: '0.02em',
                  marginBottom: '4px',
                }}
              >
                CLASS AUTO
              </p>
              <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                Oto Servis — Antalya Muratpaşa
              </p>
            </div>

            {/* Divider */}
            <hr style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '1.5rem' }} />

            {/* Address */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: '2px' }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <div>
                <p style={{ fontSize: '0.9rem', color: '#F5F6F7', lineHeight: 1.5 }}>{s.address}</p>
                {s.addressLandmark && (
                  <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '3px' }}>{s.addressLandmark}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            {hasPhone && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '1.25rem', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a
                  href={`tel:${s.phone.replace(/\s/g, '')}`}
                  style={{ fontSize: '0.9rem', color: '#F5F6F7', textDecoration: 'none' }}
                  aria-label={`Telefon: ${s.phoneDisplay || s.phone}`}
                >
                  {s.phoneDisplay || s.phone}
                </a>
              </div>
            )}

            {/* WhatsApp */}
            {hasWhatsApp && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '1.25rem', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.9rem', color: '#F5F6F7', textDecoration: 'none' }}
                  aria-label="WhatsApp ile iletişim"
                >
                  WhatsApp
                </a>
              </div>
            )}

            {/* Email */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '1.25rem', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <a
                href={`mailto:${s.email}`}
                style={{ fontSize: '0.9rem', color: '#F5F6F7', textDecoration: 'none' }}
                aria-label={`E-posta: ${s.email}`}
              >
                {s.email}
              </a>
            </div>

            {/* Working hours */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem', alignItems: 'flex-start' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: '2px' }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <p style={{ fontSize: '0.9rem', color: '#F5F6F7' }}>{s.workingHours}</p>
                <p style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '3px' }}>Pazar: Kapalı</p>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#192129',
                  color: '#F5F6F7',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '0.7rem 1.25rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                aria-label="Google Maps yol tarifi al"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                Yol Tarifi Al
              </a>

              {hasPhone && (
                <a
                  href={`tel:${s.phone.replace(/\s/g, '')}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#E30613',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    padding: '0.7rem 1.25rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                  aria-label="Hemen Ara"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Hemen Ara
                </a>
              )}

              {hasWhatsApp && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#25D366',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    padding: '0.7rem 1.25rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                  aria-label="WhatsApp'tan Yaz"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp&apos;tan Yaz
                </a>
              )}
            </div>
          </div>

          {/* ── Right: Map ── */}
          <div>
            <MapEmbed
              embedUrl={s.mapEmbedUrl}
              directionsUrl={directionsUrl}
              mapTitle="CLASS AUTO Konum Haritası"
            />
          </div>
        </div>
      </div>

      <style>{`
        .contact-map-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 767px) {
          .contact-map-grid {
            grid-template-columns: 1fr !important;
          }
        }
        #iletisim-harita {
          scroll-margin-top: 120px;
        }
      `}</style>
    </section>
  );
}
