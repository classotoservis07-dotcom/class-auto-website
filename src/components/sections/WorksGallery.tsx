'use client';

/**
 * WorksGallery — Client Component
 *
 * Masonry-style grid galeri + Lightbox (tam ekran görüntüleyici).
 * Çalışma fotoğraflarını büyütür, önceki/sonraki gezer.
 */

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface WorkItem {
  id: number;
  title: string;
  shortDesc?: string | null;
  vehicleBrand?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: number | null;
  coverImage?: string | null;
  category?: string | null;
}

interface Props {
  works: WorkItem[];
}

const CATEGORY_LABELS: Record<string, string> = {
  kaporta: 'Kaporta',
  boya: 'Boya',
  mekanik: 'Mekanik',
  elektrik: 'Oto Elektrik',
  lastik: 'Lastik',
  klima: 'Klima',
  genel: 'Genel Bakım',
  diger: 'Diğer',
};

export default function WorksGallery({ works }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Kategoriler
  const categories = ['all', ...Array.from(new Set(works.map((w) => w.category || 'diger').filter(Boolean)))];

  // Filtreli liste
  const filtered = activeCategory === 'all'
    ? works
    : works.filter((w) => (w.category || 'diger') === activeCategory);

  // Lightbox navigation
  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevLightbox = useCallback(() => {
    setLightboxIdx((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);
  const nextLightbox = useCallback(() => {
    setLightboxIdx((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  // Klavye navigasyonu
  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIdx, closeLightbox, prevLightbox, nextLightbox]);

  const lightboxWork = lightboxIdx !== null ? filtered[lightboxIdx] : null;

  return (
    <>
      {/* Kategori Filtreleri */}
      {categories.length > 2 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '7px 18px',
                borderRadius: '999px',
                border: activeCategory === cat ? '1.5px solid #E30613' : '1.5px solid #E2E6EA',
                background: activeCategory === cat ? '#E30613' : '#F5F6F7',
                color: activeCategory === cat ? '#fff' : '#66717C',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat === 'all' ? 'Tümü' : (CATEGORY_LABELS[cat] || cat)}
              <span style={{ marginLeft: '6px', opacity: 0.7, fontSize: '11px' }}>
                ({cat === 'all' ? works.length : works.filter((w) => (w.category || 'diger') === cat).length})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Galeri Grid */}
      {filtered.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {filtered.map((work, idx) => (
            <div
              key={work.id}
              onClick={() => work.coverImage && openLightbox(idx)}
              style={{
                background: '#F5F6F7',
                border: '1px solid #E2E6EA',
                borderRadius: '14px',
                overflow: 'hidden',
                cursor: work.coverImage ? 'pointer' : 'default',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              className="gallery-card"
              role={work.coverImage ? 'button' : undefined}
              tabIndex={work.coverImage ? 0 : undefined}
              aria-label={work.coverImage ? `${work.title} fotoğrafını büyüt` : undefined}
              onKeyDown={(e) => { if (e.key === 'Enter' && work.coverImage) openLightbox(idx); }}
            >
              {/* Görsel */}
              <div style={{ position: 'relative', aspectRatio: '4/3', background: '#E2E6EA', overflow: 'hidden' }}>
                {work.coverImage ? (
                  <>
                    <Image
                      src={work.coverImage}
                      alt={work.title}
                      fill
                      style={{ objectFit: 'cover', transition: 'transform 0.35s ease' }}
                      className="gallery-img"
                      unoptimized
                    />
                    {/* Hover overlay */}
                    <div className="gallery-overlay" style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(13,17,23,0.45)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.25s',
                    }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D252D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" aria-hidden="true">
                      <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                  </div>
                )}

                {/* Kategori badge */}
                {work.category && (
                  <div style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: 'rgba(227,6,19,0.9)', color: '#fff',
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
                    padding: '3px 9px', borderRadius: '999px', textTransform: 'uppercase',
                  }}>
                    {CATEGORY_LABELS[work.category] || work.category}
                  </div>
                )}
              </div>

              {/* Bilgi */}
              <div style={{ padding: '16px' }}>
                {(work.vehicleBrand || work.vehicleModel) && (
                  <p style={{ color: '#E30613', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    {work.vehicleBrand} {work.vehicleModel}{work.vehicleYear ? ` · ${work.vehicleYear}` : ''}
                  </p>
                )}
                <h3 style={{ color: '#1D252D', fontWeight: 700, fontSize: '15px', fontFamily: 'Oswald, Arial Narrow, sans-serif', marginBottom: work.shortDesc ? '6px' : 0 }}>
                  {work.title}
                </h3>
                {work.shortDesc && (
                  <p style={{ color: '#66717C', fontSize: '13px', lineHeight: 1.5 }}>
                    {work.shortDesc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#9CA3AF' }}>
          <p style={{ fontSize: '15px' }}>Bu kategoride çalışma bulunamadı.</p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxWork && lightboxIdx !== null && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.94)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxWork.title}
        >
          {/* Kapat */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: '20px', right: '20px', zIndex: 10,
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Kapat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Önceki */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
              style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 10, width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Önceki"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          )}

          {/* Görsel + Bilgi */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative', maxWidth: '90vw', maxHeight: '90vh',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
            }}
          >
            <div style={{ position: 'relative', maxWidth: '860px', width: '90vw', maxHeight: '70vh', borderRadius: '12px', overflow: 'hidden', background: '#111' }}>
              {lightboxWork.coverImage ? (
                <Image
                  src={lightboxWork.coverImage}
                  alt={lightboxWork.title}
                  width={860}
                  height={600}
                  style={{ objectFit: 'contain', maxHeight: '70vh', width: '100%', height: 'auto' }}
                  unoptimized
                  priority
                />
              ) : (
                <div style={{ width: '860px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                    <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Başlık ve açıklama */}
            <div style={{ textAlign: 'center' }}>
              {(lightboxWork.vehicleBrand || lightboxWork.vehicleModel) && (
                <p style={{ color: '#E30613', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  {lightboxWork.vehicleBrand} {lightboxWork.vehicleModel}{lightboxWork.vehicleYear ? ` · ${lightboxWork.vehicleYear}` : ''}
                </p>
              )}
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '16px', fontFamily: 'Oswald, Arial Narrow, sans-serif', marginBottom: '4px' }}>
                {lightboxWork.title}
              </p>
              {lightboxWork.shortDesc && (
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>{lightboxWork.shortDesc}</p>
              )}
              <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '8px' }}>
                {lightboxIdx + 1} / {filtered.length}
              </p>
            </div>
          </div>

          {/* Sonraki */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 10, width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Sonraki"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          )}
        </div>
      )}

      <style>{`
        .gallery-card:hover .gallery-img { transform: scale(1.05); }
        .gallery-card:hover .gallery-overlay { opacity: 1 !important; }
        .gallery-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
      `}</style>
    </>
  );
}
