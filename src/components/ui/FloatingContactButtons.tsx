'use client';

/**
 * FloatingContactButtons — CLASS AUTO
 * Yuvarlak, ikon-only FAB butonlar.
 * Masaüstü: sağ ortada dikey 3 daire + aşağı ok
 * Mobil: sağ altta 2 daire (WA üstte, telefon altta)
 */

import { useState, useEffect, useRef } from 'react';

interface Props {
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  appointmentUrl?: string;
}

/* Tooltip wrapper */
function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className="group">
      {children}
      {/* Tooltip — solda görünür */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '62px',
          background: '#1D252D',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 600,
          padding: '5px 10px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.15s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
        className="group-hover:opacity-100"
      >
        {label}
        <span style={{ position: 'absolute', right: '-5px', top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '5px solid #1D252D' }} />
      </span>
    </div>
  );
}

/* Yuvarlak FAB butonu */
function Fab({
  href, ariaLabel, bg, shadow, children, target, rel,
}: {
  href: string; ariaLabel: string; bg: string; shadow: string;
  children: React.ReactNode; target?: string; rel?: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={target}
      rel={rel}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: bg,
        color: '#fff',
        textDecoration: 'none',
        boxShadow: shadow,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
    >
      {children}
    </a>
  );
}

/* SVG İkonlar */
const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const WaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const CalIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export default function FloatingContactButtons({ phone, whatsapp, whatsappMessage, appointmentUrl = '/iletisim' }: Props) {
  const [footerVisible, setFooterVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const hasPhone = Boolean(phone?.trim());
  const hasWa = Boolean(whatsapp?.trim());
  const waNum = whatsapp?.replace(/\D/g, '') || '';
  const waHref = hasWa ? `https://wa.me/${waNum}?text=${encodeURIComponent(whatsappMessage)}` : '#';
  const telHref = hasPhone ? `tel:${phone.replace(/\s/g, '')}` : '#';

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    observerRef.current = new IntersectionObserver(
      ([e]) => setFooterVisible(e.isIntersecting),
      { threshold: 0.05 }
    );
    observerRef.current.observe(footer);
    return () => observerRef.current?.disconnect();
  }, []);

  /* Sayfanın en altına kaydır */
  const scrollToBottom = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  if (footerVisible) return null;

  return (
    <>
      {/* ─── MASAÜSTÜ: sağ ortada dikey FAB'lar ─── */}
      <nav
        aria-label="Hızlı iletişim"
        className="hidden md:flex"
        style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 45,
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {hasPhone && (
          <Tip label="Hemen Ara">
            <Fab href={telHref} ariaLabel="Hemen Ara" bg="#E30613" shadow="0 4px 16px rgba(227,6,19,0.40)">
              <PhoneIcon />
            </Fab>
          </Tip>
        )}

        {hasWa && (
          <Tip label="WhatsApp">
            <Fab href={waHref} ariaLabel="WhatsApp ile yaz" bg="#25D366" shadow="0 4px 16px rgba(37,211,102,0.40)" target="_blank" rel="noopener noreferrer">
              <WaIcon />
            </Fab>
          </Tip>
        )}

        <Tip label="Randevu Al">
          <Fab href={appointmentUrl} ariaLabel="Randevu Al" bg="#202A34" shadow="0 4px 16px rgba(32,42,52,0.35)">
            <CalIcon />
          </Fab>
        </Tip>

        {/* Ayırıcı çizgi */}
        <div style={{ width: '2px', height: '24px', background: 'rgba(0,0,0,0.12)', borderRadius: '2px' }} aria-hidden="true" />

        {/* Aşağı ok — en alta kaydır */}
        <a
          href="#iletisim-harita"
          onClick={scrollToBottom}
          aria-label="İletişim ve yol tarifine git — sayfanın en altına git"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#fff',
            border: '2px solid #E2E6EA',
            color: '#E30613',
            textDecoration: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
            animation: 'fab-bob 2s ease-in-out infinite',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </a>
      </nav>

      {/* ─── MOBİL: sağ altta 2 daire ─── */}
      <nav
        aria-label="Hızlı iletişim"
        className="flex md:hidden"
        style={{
          position: 'fixed',
          right: '16px',
          bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
          zIndex: 45,
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {hasWa && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp ile iletişim"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '54px', height: '54px', borderRadius: '50%',
              background: '#25D366', color: '#fff',
              boxShadow: '0 4px 18px rgba(37,211,102,0.45)',
              textDecoration: 'none',
            }}
          >
            <WaIcon />
          </a>
        )}
        {hasPhone && (
          <a
            href={telHref}
            aria-label="Hemen Ara"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '54px', height: '54px', borderRadius: '50%',
              background: '#E30613', color: '#fff',
              boxShadow: '0 4px 18px rgba(227,6,19,0.45)',
              textDecoration: 'none',
            }}
          >
            <PhoneIcon />
          </a>
        )}
      </nav>

      {/* Animasyon keyframe */}
      <style>{`
        @keyframes fab-bob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(5px); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes fab-bob { 0%, 100% { transform: translateY(0); } }
        }
        .group:hover .group-hover\\:opacity-100 { opacity: 1 !important; }
      `}</style>
    </>
  );
}
