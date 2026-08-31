/**
 * CLASS AUTO — Footer (Server Component)
 * DB'den logo, iletişim ve sosyal medya bilgilerini okur.
 */

import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettings } from '@/lib/site-settings';
import { SERVICES } from '@/lib/config';

const QUICK_LINKS = [
  { href: '/',               label: 'Ana Sayfa' },
  { href: '/hizmetler',      label: 'Hizmetlerimiz' },
  { href: '/hakkimizda',     label: 'Hakkımızda' },
  { href: '/calismalarimiz', label: 'Çalışmalarımız' },
  { href: '/sss',            label: 'Sık Sorulan Sorular' },
  { href: '/iletisim',       label: 'İletişim' },
];

const LEGAL_LINKS = [
  { href: '/kvkk',             label: 'KVKK Aydınlatma Metni' },
  { href: '/gizlilik',         label: 'Gizlilik Politikası' },
  { href: '/cerez-politikasi', label: 'Çerez Politikası' },
];

const MAPS_URL = 'https://maps.google.com/?q=Güzeloba+Mahallesi+Havaalanı+Caddesi+No:11/D+Muratpaşa+Antalya';

export default async function Footer() {
  const s = await getSiteSettings();
  const currentYear = new Date().getFullYear();

  // Footer logosu: önce footer-specific, sonra ana logo
  const footerLogo = s.logoFooter || s.logoMain || s.logoDark || '';

  const whatsappNum = s.whatsapp?.replace(/\D/g, '');
  const whatsappUrl = whatsappNum
    ? `https://wa.me/${whatsappNum}?text=${encodeURIComponent(s.whatsappMessage || 'Merhaba, randevu almak istiyorum.')}`
    : null;

  const serviceLinks = SERVICES.map((sv) => ({ href: sv.slug, label: sv.title }));

  return (
    <footer style={{ background: '#0E1115', borderTop: '1px solid #1E252D' }} role="contentinfo">

      {/* CTA Şerit */}
      <div style={{ background: '#E30613' }}>
        <div className="container-site" style={{ padding: '24px 0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <p style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '20px', fontWeight: 700, color: '#fff' }}>
              Aracınızın Bakımını Ertelemeyin
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>
              Uzman ekibimiz aracınız için hazır.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#fff', color: '#E30613', fontSize: '14px', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            )}
            <Link
              href="/iletisim"
              style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '14px', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Randevu Al
            </Link>
          </div>
        </div>
      </div>

      {/* Ana Footer */}
      <div className="container-site" style={{ padding: '56px 0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>

          {/* Marka */}
          <div>
            <Link href="/" aria-label={`${s.brandName} — Ana Sayfa`} style={{ display: 'inline-block', marginBottom: '20px' }}>
              {footerLogo ? (
                <Image
                  src={footerLogo}
                  alt={`${s.brandName} Oto Servis Logosu`}
                  width={200}
                  height={60}
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'left center',
                    height: '44px',
                    width: 'auto',
                    maxWidth: '180px',
                    filter: 'brightness(0) invert(1)',
                  }}
                  unoptimized
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="36" height="36" viewBox="0 0 38 38" fill="none" aria-hidden="true">
                    <circle cx="19" cy="19" r="18" stroke="#E30613" strokeWidth="1.5"/>
                    <circle cx="19" cy="19" r="7" fill="#E30613"/>
                    <circle cx="19" cy="19" r="3" fill="#0E1115"/>
                    <line x1="1" y1="19" x2="7" y2="19" stroke="#E30613" strokeWidth="1.5"/>
                    <line x1="31" y1="19" x2="37" y2="19" stroke="#E30613" strokeWidth="1.5"/>
                    <line x1="19" y1="1" x2="19" y2="7" stroke="#E30613" strokeWidth="1.5"/>
                    <line x1="19" y1="31" x2="19" y2="37" stroke="#E30613" strokeWidth="1.5"/>
                  </svg>
                  <div>
                    <div style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '16px', fontWeight: 700, color: '#F5F6F7', letterSpacing: '0.12em', lineHeight: 1 }}>CLASS</div>
                    <div style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '11px', fontWeight: 600, color: '#E30613', letterSpacing: '0.28em', lineHeight: 1, marginTop: '3px' }}>AUTO</div>
                  </div>
                </div>
              )}
            </Link>
            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
              Mekanikten kaporta ve boyaya, arıza tespitinden lastik hizmetlerine kadar tüm ihtiyaçlarınız CLASS AUTO güvencesiyle.
            </p>
            {/* Sosyal */}
            {(s.instagram || s.facebook || s.youtube) && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {s.instagram && (
                  <a href={s.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    style={{ width: '36px', height: '36px', background: '#1E252D', border: '1px solid #2A3340', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', textDecoration: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {s.facebook && (
                  <a href={s.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    style={{ width: '36px', height: '36px', background: '#1E252D', border: '1px solid #2A3340', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', textDecoration: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {s.youtube && (
                  <a href={s.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                    style={{ width: '36px', height: '36px', background: '#1E252D', border: '1px solid #2A3340', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', textDecoration: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Hızlı Erişim */}
          <div>
            <h3 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '13px', fontWeight: 700, color: '#F5F6F7', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>Hızlı Erişim</h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontSize: '14px', textDecoration: 'none' }}>
                    <span style={{ width: '4px', height: '4px', background: '#E30613', borderRadius: '50%', flexShrink: 0 }} aria-hidden="true"/>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hizmetlerimiz */}
          <div>
            <h3 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '13px', fontWeight: 700, color: '#F5F6F7', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>Hizmetlerimiz</h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontSize: '14px', textDecoration: 'none' }}>
                    <span style={{ width: '4px', height: '4px', background: '#E30613', borderRadius: '50%', flexShrink: 0 }} aria-hidden="true"/>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '13px', fontWeight: 700, color: '#F5F6F7', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>İletişim</h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Adres */}
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6 }}>{s.address}</p>
                  {s.addressLandmark && <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>{s.addressLandmark}</p>}
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#E30613', fontSize: '12px', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}>Yol Tarifi Al →</a>
                </div>
              </li>
              {/* Telefon */}
              {s.phone && s.phone.trim() ? (
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <a href={`tel:${s.phone}`} style={{ color: '#9CA3AF', fontSize: '14px', textDecoration: 'none' }}>{s.phoneDisplay || s.phone}</a>
                </li>
              ) : null}
              {/* E-posta */}
              {s.email && (
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <a href={`mailto:${s.email}`} style={{ color: '#9CA3AF', fontSize: '14px', textDecoration: 'none' }}>{s.email}</a>
                </li>
              )}
              {/* Çalışma Saatleri */}
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '14px' }}>{s.workingHours}</p>
                  <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>Pazar: Kapalı</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Alt Bar */}
      <div style={{ borderTop: '1px solid #1E252D' }}>
        <div className="container-site" style={{ padding: '20px 0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>
            &copy; {currentYear} {s.brandName}. Tüm hakları saklıdır.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="footer-legal-link" style={{ color: '#6B7280', fontSize: '13px', textDecoration: 'none' }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
