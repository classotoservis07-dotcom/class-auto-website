'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type NavLink = { href: string; label: string };

interface ClientHeaderProps {
  logoSrc: string;
  logoAlt: string;
  brandName: string;
  navLinks: NavLink[];
  whatsappUrl: string | null;
  phone?: string;
  address?: string;
  workingHours?: string;
  email?: string;
}

/* ══════════════════════════════════════════════════════════
   MOBİL DRAWER
══════════════════════════════════════════════════════════ */
function MobileDrawer({
  links, isOpen, onClose, logoSrc, logoAlt, brandName, whatsappUrl, phone,
}: {
  links: NavLink[]; isOpen: boolean; onClose: () => void;
  logoSrc: string; logoAlt: string; brandName: string;
  whatsappUrl: string | null; phone?: string;
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div aria-hidden="true" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 49, background: 'rgba(32,42,52,0.75)', backdropFilter: 'blur(4px)', opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none', transition: 'opacity 0.25s' }} />
      <div role="dialog" aria-modal="true" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(320px,90vw)', zIndex: 50, background: '#fff', transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)' }}>
        {/* Üst kırmızı bant */}
        <div style={{ background: '#E30613', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {logoSrc ? (
            <Image src={logoSrc} alt={logoAlt} width={120} height={38} style={{ objectFit: 'contain', height: '32px', width: 'auto' }} unoptimized />
          ) : (
            <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '0.1em' }}>{brandName}</span>
          )}
          <button onClick={onClose} aria-label="Menüyü kapat" style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Nav linkleri */}
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {links.map((link, i) => (
            <Link key={link.href} href={link.href} onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', color: '#202A34', fontSize: '15px', fontWeight: 600, textDecoration: 'none', borderBottom: i < links.length - 1 ? '1px solid #f0f0f0' : 'none', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {link.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          ))}
        </nav>

        {/* CTA butonları */}
        <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {phone && (
            <a href={`tel:${phone}`} onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', background: '#202A34', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 700 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {phone}
            </a>
          )}
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', background: '#25D366', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 700 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          )}
          <Link href="/iletisim" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px', background: '#E30613', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 700 }}>
            Randevu Al
          </Link>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   ANA CLIENT HEADER
══════════════════════════════════════════════════════════ */
export default function ClientHeader({
  logoSrc, logoAlt, brandName, navLinks, whatsappUrl,
  phone, address, workingHours, email,
}: ClientHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => { setScrolled(window.scrollY > 50); }, []);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const topBarHeight = scrolled ? 0 : 36; // px
  const headerHeight = scrolled ? 64 : 80; // px
  const totalHeight = topBarHeight + headerHeight;

  return (
    <>
      {/* ── SPACER: Header + TopBar kadar boşluk bırakır ── */}
      <div style={{ height: `${80 + 36}px` }} aria-hidden="true" />

      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
          boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.12)' : 'none',
          transition: 'box-shadow 0.3s',
        }}
      >
        {/* ══ ÜST KIRMIZI BANT ══════════════════════════════════════ */}
        <div
          style={{
            background: '#E30613',
            height: scrolled ? '0' : '36px',
            overflow: 'hidden',
            transition: 'height 0.3s ease',
          }}
          aria-hidden={scrolled}
        >
          <div className="container-site" style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            {/* Sol: Adres + Saat */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {address && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(255,255,255,0.92)', whiteSpace: 'nowrap' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="hidden sm:inline">{address}</span>
                  <span className="sm:hidden">Güzeloba, Muratpaşa / Antalya</span>
                </span>
              )}
              {workingHours && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(255,255,255,0.92)', whiteSpace: 'nowrap' }} className="hidden md:flex">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {workingHours}
                </span>
              )}
            </div>
            {/* Sağ: Tel + Email */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {email && (
                <a href={`mailto:${email}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(255,255,255,0.9)', textDecoration: 'none', whiteSpace: 'nowrap' }} className="hidden md:flex">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 700, color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ══ BEYAZ ANA HEADER ══════════════════════════════════════ */}
        <header
          style={{
            background: '#ffffff',
            height: `${headerHeight}px`,
            transition: 'height 0.3s ease',
            borderBottom: '2px solid #f0f0f0',
          }}
          role="banner"
        >
          <div className="container-site" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

            {/* ── LOGO ── */}
            <Link href="/" aria-label={`${brandName} — Ana Sayfa`} style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={200}
                  height={70}
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'left center',
                    height: scrolled ? '48px' : '60px',
                    width: 'auto',
                    maxWidth: '220px',
                    transition: 'height 0.3s',
                  }}
                  priority
                  unoptimized
                />
              ) : (
                /* Fallback metin logosu */
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: scrolled ? 40 : 48, height: scrolled ? 40 : 48, background: '#202A34', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}>
                    <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: scrolled ? '14px' : '16px', fontWeight: 700, color: '#E30613', letterSpacing: '0.05em' }}>CA</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: scrolled ? '16px' : '20px', fontWeight: 700, color: '#202A34', letterSpacing: '0.12em', lineHeight: 1, transition: 'font-size 0.3s' }}>CLASS</div>
                    <div style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: scrolled ? '9px' : '11px', fontWeight: 600, color: '#E30613', letterSpacing: '0.3em', lineHeight: 1, marginTop: '3px', transition: 'font-size 0.3s' }}>AUTO</div>
                  </div>
                </div>
              )}
            </Link>

            {/* ── MASAÜSTÜ NAV ── */}
            <nav className="hidden lg:flex" style={{ alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }} aria-label="Ana navigasyon">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '8px 14px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#202A34',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                    fontFamily: 'Oswald, Arial Narrow, sans-serif',
                    transition: 'all 0.15s',
                    position: 'relative' as const,
                    whiteSpace: 'nowrap' as const,
                  }}
                  className="nav-link-site"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── SAĞ AKSIYONLAR ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {/* WhatsApp */}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex"
                  style={{ alignItems: 'center', gap: '6px', padding: '9px 16px', background: '#25D366', color: '#fff', fontSize: '13px', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}
                  aria-label="WhatsApp ile iletişim"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              )}

              {/* Randevu Al */}
              <Link
                href="/iletisim"
                className="hidden sm:inline-flex"
                style={{ alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#E30613', color: '#fff', fontSize: '13px', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase' as const, fontFamily: 'Oswald, sans-serif' }}
              >
                Randevu Al
              </Link>

              {/* Hamburger */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden"
                style={{ padding: '8px', background: '#f5f5f5', border: '1px solid #e0e0e0', color: '#202A34', cursor: 'pointer', borderRadius: '8px' }}
                aria-label="Menüyü aç"
                aria-expanded={mobileOpen}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobil Drawer */}
      <MobileDrawer
        links={navLinks}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        logoSrc={logoSrc}
        logoAlt={logoAlt}
        brandName={brandName}
        whatsappUrl={whatsappUrl}
        phone={phone}
      />
    </>
  );
}
