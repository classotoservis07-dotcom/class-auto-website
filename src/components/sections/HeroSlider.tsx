'use client';

/**
 * HeroSlider — Client Component
 *
 * Auto-sliding hero with fade+slide animation.
 * Dot indicators + prev/next arrows.
 * Pause on hover. prefers-reduced-motion respected.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface HeroSlideData {
  id: number;
  title: string;
  subtitle: string;
  bgImage?: string | null;
  overlayOpacity?: number;
  btn1Text: string;
  btn1Url: string;
  btn2Text: string;
  btn2Url: string;
  badgeText?: string | null;
}

interface Props {
  slides: HeroSlideData[];
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  height?: string;
}

/** Highlight keywords with brand red */
function highlightTitle(title: string): string {
  return title
    .replace(/(Profesyonel)/g, '<span style="color:#E30613">$1</span>')
    .replace(/(Güvenilir)/g, '<span style="color:#E30613">$1</span>')
    .replace(/(Oto Servis)/g, '<span style="color:#E30613">$1</span>')
    .replace(/(Kaporta)/g, '<span style="color:#E30613">$1</span>')
    .replace(/(Boya)/g, '<span style="color:#E30613">$1</span>')
    .replace(/(Bilgisayarlı)/g, '<span style="color:#E30613">$1</span>')
    .replace(/(Arıza Tespit)/g, '<span style="color:#E30613">$1</span>')
    .replace(/(Oto Elektrik)/g, '<span style="color:#E30613">$1</span>');
}

const TRUST_BADGES = [
  'Tüm Marka ve Modellere Hizmet',
  'İşlem Öncesi Bilgilendirme',
  'Modern Arıza Tespit',
  'Kolay Randevu',
];

export default function HeroSlider({ slides, phone, whatsapp, whatsappMessage, height = '92vh' }: Props) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = slides.length;

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-slide başlat/durdur
  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (reducedMotion || total <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 6000);
  }, [reducedMotion, total]);

  useEffect(() => {
    if (!paused) startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, startInterval]);

  // Manuel geçiş: timer'ı resetler, hover yoksa 6sn sonra devam eder
  const goTo = useCallback((index: number, isManual = false) => {
    if (isAnimating || index === current) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 500);
    if (isManual) {
      // Timer'ı durdur, 6sn bekle, tekrar başlat
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        if (!paused) startInterval();
      }, 6000);
    }
  }, [isAnimating, current, paused, startInterval]);

  const next = useCallback((isManual = false) => goTo((current + 1) % total, isManual), [current, total, goTo]);
  const prev = useCallback((isManual = false) => goTo((current - 1 + total) % total, isManual), [current, total, goTo]);

  const slide = slides[current];
  const waNum = whatsapp?.replace(/\D/g, '') || '';
  const waHref = waNum
    ? `https://wa.me/${waNum}?text=${encodeURIComponent(whatsappMessage || 'Merhaba, randevu almak istiyorum.')}`
    : '/iletisim';

  return (
    <section
      style={{ position: 'relative', minHeight: height, overflow: 'hidden', background: 'linear-gradient(160deg, #0D1117, #11171D)' }}
      aria-label="Hero Slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── BG Image ── */}
      {slide.bgImage && (
        <div style={{ position: 'absolute', inset: 0, transition: 'opacity 0.5s ease' }}>
          <Image
            src={slide.bgImage}
            alt=""
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            unoptimized
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `rgba(13,17,23,${(slide.overlayOpacity ?? 55) / 100})`,
            }}
          />
        </div>
      )}

      {/* Decorative bg (no image) */}
      {!slide.bgImage && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
          <div style={{ position: 'absolute', top: 0, right: 0, width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,6,19,0.07) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,6,19,0.04) 0%, transparent 70%)' }} />
        </div>
      )}

      {/* ── Slide Content ── */}
      <div
        key={current}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          minHeight: height,
          paddingTop: '8rem',
          paddingBottom: '6rem',
          opacity: isAnimating && !reducedMotion ? 0 : 1,
          transform: isAnimating && !reducedMotion ? 'translateY(12px)' : 'translateY(0)',
          transition: reducedMotion ? 'none' : 'opacity 0.45s ease, transform 0.45s ease',
        }}
      >
        <div className="container-site">
          <div style={{ maxWidth: '760px' }}>

            {/* Location / keyword badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(227,6,19,0.35)',
              background: 'rgba(227,6,19,0.09)',
              marginBottom: '20px',
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E30613', flexShrink: 0 }} aria-hidden="true" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#E30613', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {slide.badgeText || 'Antalya Muratpaşa — Güzeloba'}
              </span>
            </div>

            {/* Title — H2 (page.tsx provides single H1 wrapper) */}
            <h2
              style={{
                fontFamily: 'Oswald, Arial Narrow, sans-serif',
                fontSize: 'clamp(2rem, 6vw, 3.75rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                color: '#F5F6F7',
                marginBottom: '20px',
              }}
              dangerouslySetInnerHTML={{ __html: highlightTitle(slide.title) }}
            />

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '600px' }}>
              {slide.subtitle}
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '2.5rem' }}>
              {/* Btn1 — WA */}
              <a
                href={slide.btn1Url.startsWith('http') ? slide.btn1Url : waHref}
                target={slide.btn1Url.startsWith('http') ? '_blank' : undefined}
                rel={slide.btn1Url.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#25D366', color: '#fff',
                  fontWeight: 700, fontSize: '0.9375rem',
                  padding: '0.75rem 1.75rem', borderRadius: '8px',
                  textDecoration: 'none', minHeight: '48px',
                }}
                aria-label={slide.btn1Text}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {slide.btn1Text}
              </a>

              {/* Btn2 */}
              <a
                href={slide.btn2Url}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#F5F6F7',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontWeight: 600, fontSize: '0.9375rem',
                  padding: '0.75rem 1.75rem', borderRadius: '8px',
                  textDecoration: 'none', minHeight: '48px',
                }}
                aria-label={slide.btn2Text}
              >
                {slide.btn2Text}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>

              {/* Phone button */}
              {phone?.trim() && (
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: '#E30613', color: '#fff',
                    fontWeight: 700, fontSize: '0.9375rem',
                    padding: '0.75rem 1.75rem', borderRadius: '8px',
                    textDecoration: 'none', minHeight: '48px',
                  }}
                  aria-label="Hemen Ara"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Hemen Ara
                </a>
              )}
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {TRUST_BADGES.map((badge) => (
                <span
                  key={badge}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '999px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#9CA3AF', fontSize: '12px',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Arrows ── */}
      {total > 1 && (
        <>
          <button
            onClick={() => prev(true)}
            aria-label="Önceki slayt"
            style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 20, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button
            onClick={() => next(true)}
            aria-label="Sonraki slayt"
            style={{
              position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 20, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </>
      )}

      {/* ── Dots ── */}
      {total > 1 && (
        <div style={{
          position: 'absolute', bottom: '64px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, display: 'flex', gap: '8px', alignItems: 'center',
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, true)}
              aria-label={`Slayt ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
              style={{
                width: i === current ? '24px' : '8px', height: '8px',
                borderRadius: '999px',
                background: i === current ? '#E30613' : 'rgba(255,255,255,0.35)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Scroll indicator ── */}
      <div
        style={{
          position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
          opacity: 0.35,
        }}
        aria-hidden="true"
      >
        <div style={{ width: '1px', height: '24px', background: '#9CA3AF' }} />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
    </section>
  );
}
