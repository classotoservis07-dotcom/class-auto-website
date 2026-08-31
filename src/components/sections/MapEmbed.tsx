'use client';

/**
 * MapEmbed — Client Component
 * Shows a placeholder, loads iframe on user click.
 */

import { useState } from 'react';

interface MapEmbedProps {
  embedUrl: string;
  directionsUrl: string;
  mapTitle?: string;
}

export default function MapEmbed({ embedUrl, directionsUrl, mapTitle = 'CLASS AUTO Konum Haritası' }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (!embedUrl) {
    // No embed URL — show static link
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '360px',
          background: '#F5F6F7',
          borderRadius: '12px',
          border: '1px solid #E2E6EA',
          gap: '16px',
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#66717C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <p style={{ color: '#66717C', fontSize: '0.9rem', textAlign: 'center' }}>
          Konumumuzu haritada görüntülemek için aşağıdaki butona tıklayın.
        </p>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#202A34',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.9rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            textDecoration: 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          Google Maps&apos;te Aç
        </a>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '420px', border: '1px solid #E2E6EA' }}>
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F5F6F7',
            gap: '16px',
            cursor: 'pointer',
            zIndex: 2,
          }}
          onClick={() => setLoaded(true)}
          role="button"
          tabIndex={0}
          aria-label="Haritayı yükle"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLoaded(true); }}
        >
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          <p style={{ color: '#1D252D', fontWeight: 600, fontSize: '0.95rem' }}>CLASS AUTO konumu</p>
          <button
            onClick={() => setLoaded(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#E30613',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Haritayı Aç
          </button>
          <p style={{ color: '#66717C', fontSize: '11px' }}>Google Maps yüklenir</p>
        </div>
      )}

      {loaded && (
        <iframe
          src={embedUrl}
          title={mapTitle}
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          tabIndex={0}
        />
      )}
    </div>
  );
}
