'use client';

/**
 * BrandLogos — Otomotiv marka logolarını SVG inline olarak gösterir.
 * Yazı yerine tanınan marka sembolleri kullanılır.
 * Client Component (marquee animasyonu için).
 */

const BRANDS = [
  {
    name: 'BMW',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="BMW">
        <circle cx="40" cy="40" r="38" stroke="#1C69D4" strokeWidth="4"/>
        <circle cx="40" cy="40" r="28" fill="#1C69D4"/>
        <path d="M40 12 A28 28 0 0 1 68 40 L40 40 Z" fill="white"/>
        <path d="M40 68 A28 28 0 0 1 12 40 L40 40 Z" fill="white"/>
        <circle cx="40" cy="40" r="6" fill="white"/>
        <text x="40" y="75" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1C69D4" fontFamily="Arial">BMW</text>
      </svg>
    ),
  },
  {
    name: 'Mercedes',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mercedes-Benz">
        <circle cx="40" cy="40" r="38" stroke="#333" strokeWidth="3" fill="white"/>
        <circle cx="40" cy="40" r="30" stroke="#333" strokeWidth="1.5" fill="none"/>
        <path d="M40 12 L40 40" stroke="#333" strokeWidth="2.5"/>
        <path d="M40 40 L14 55" stroke="#333" strokeWidth="2.5"/>
        <path d="M40 40 L66 55" stroke="#333" strokeWidth="2.5"/>
        <text x="40" y="76" textAnchor="middle" fontSize="7" fontWeight="600" fill="#333" fontFamily="Arial">MERCEDES</text>
      </svg>
    ),
  },
  {
    name: 'Audi',
    svg: (
      <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Audi">
        <circle cx="20" cy="25" r="16" stroke="#333" strokeWidth="3" fill="none"/>
        <circle cx="40" cy="25" r="16" stroke="#333" strokeWidth="3" fill="none"/>
        <circle cx="60" cy="25" r="16" stroke="#333" strokeWidth="3" fill="none"/>
        <circle cx="80" cy="25" r="16" stroke="#333" strokeWidth="3" fill="none"/>
      </svg>
    ),
  },
  {
    name: 'Volkswagen',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Volkswagen">
        <circle cx="40" cy="40" r="38" fill="#1D4DB5" stroke="#1D4DB5" strokeWidth="2"/>
        <circle cx="40" cy="40" r="28" fill="none" stroke="white" strokeWidth="2"/>
        <text x="40" y="33" textAnchor="middle" fontSize="11" fontWeight="900" fill="white" fontFamily="Arial">V</text>
        <line x1="28" y1="38" x2="52" y2="38" stroke="white" strokeWidth="2"/>
        <text x="40" y="53" textAnchor="middle" fontSize="11" fontWeight="900" fill="white" fontFamily="Arial">W</text>
      </svg>
    ),
  },
  {
    name: 'Toyota',
    svg: (
      <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Toyota">
        <ellipse cx="60" cy="30" rx="28" ry="18" stroke="#EB0A1E" strokeWidth="4" fill="none"/>
        <ellipse cx="60" cy="30" rx="12" ry="28" stroke="#EB0A1E" strokeWidth="4" fill="none"/>
        <ellipse cx="60" cy="12" rx="38" ry="10" stroke="#EB0A1E" strokeWidth="4" fill="none"/>
      </svg>
    ),
  },
  {
    name: 'Ford',
    svg: (
      <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Ford">
        <ellipse cx="60" cy="30" rx="56" ry="26" fill="#003478" stroke="#003478"/>
        <text x="60" y="38" textAnchor="middle" fontSize="26" fontWeight="bold" fill="white" fontFamily="'Times New Roman', serif" fontStyle="italic">Ford</text>
      </svg>
    ),
  },
  {
    name: 'Renault',
    svg: (
      <svg viewBox="0 0 70 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Renault">
        <polygon points="35,4 66,22 66,58 35,76 4,58 4,22" fill="#FFD700" stroke="#FFD700"/>
        <polygon points="35,15 55,27 55,53 35,65 15,53 15,27" fill="#EFCD00" stroke="none"/>
        <path d="M35 15 L50 40 L35 65 L20 40 Z" fill="#FFD700" stroke="#C0A000" strokeWidth="1"/>
        <text x="35" y="95" textAnchor="middle" fontSize="9" fontWeight="700" fill="#555" fontFamily="Arial">RENAULT</text>
      </svg>
    ),
  },
  {
    name: 'Peugeot',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Peugeot">
        <rect x="2" y="2" width="76" height="76" rx="8" fill="#333" stroke="#333"/>
        <text x="40" y="52" textAnchor="middle" fontSize="42" fill="white" fontFamily="Arial">🦁</text>
        <text x="40" y="75" textAnchor="middle" fontSize="8" fontWeight="700" fill="#666" fontFamily="Arial">PEUGEOT</text>
      </svg>
    ),
  },
  {
    name: 'Fiat',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Fiat">
        <circle cx="40" cy="40" r="38" fill="#C41E3A" stroke="#C41E3A"/>
        <text x="40" y="52" textAnchor="middle" fontSize="28" fontWeight="900" fill="white" fontFamily="Arial" fontStyle="italic">FIAT</text>
      </svg>
    ),
  },
  {
    name: 'Hyundai',
    svg: (
      <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Hyundai">
        <ellipse cx="50" cy="25" rx="46" ry="21" fill="#002C5F"/>
        <text x="50" y="33" textAnchor="middle" fontSize="22" fontWeight="900" fill="white" fontFamily="Arial" fontStyle="italic">H</text>
      </svg>
    ),
  },
  {
    name: 'Kia',
    svg: (
      <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Kia">
        <rect x="2" y="5" width="96" height="40" rx="6" fill="#BB162B"/>
        <text x="50" y="33" textAnchor="middle" fontSize="24" fontWeight="900" fill="white" fontFamily="Arial" letterSpacing="4">KIA</text>
      </svg>
    ),
  },
  {
    name: 'Opel',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Opel">
        <circle cx="40" cy="40" r="38" stroke="#FFD700" strokeWidth="4" fill="white"/>
        <ellipse cx="40" cy="40" rx="22" ry="22" stroke="#333" strokeWidth="3" fill="none"/>
        <path d="M18 40 Q30 20 52 40 Q64 50 52 60 Q40 68 28 60 Q18 52 18 40Z" fill="#FFD700" stroke="none"/>
        <text x="40" y="76" textAnchor="middle" fontSize="8" fontWeight="700" fill="#333" fontFamily="Arial">OPEL</text>
      </svg>
    ),
  },
  {
    name: 'Honda',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Honda">
        <rect x="2" y="12" width="76" height="56" rx="4" fill="#CC0000"/>
        <text x="40" y="52" textAnchor="middle" fontSize="36" fontWeight="900" fill="white" fontFamily="Arial">H</text>
      </svg>
    ),
  },
  {
    name: 'Volvo',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Volvo">
        <circle cx="40" cy="40" r="38" fill="none" stroke="#003057" strokeWidth="4"/>
        <circle cx="40" cy="40" r="26" fill="none" stroke="#003057" strokeWidth="3"/>
        <path d="M55 25 L65 15" stroke="#003057" strokeWidth="3"/>
        <path d="M60 15 L65 15 L65 20" stroke="#003057" strokeWidth="3" fill="none"/>
        <text x="40" y="48" textAnchor="middle" fontSize="12" fontWeight="700" fill="#003057" fontFamily="Arial">VOLVO</text>
      </svg>
    ),
  },
  {
    name: 'Citroën',
    svg: (
      <svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Citroën">
        <rect x="2" y="2" width="76" height="46" rx="4" fill="#8B0000"/>
        <path d="M20 32 Q40 10 60 32" stroke="white" strokeWidth="3" fill="none"/>
        <path d="M20 42 Q40 20 60 42" stroke="white" strokeWidth="3" fill="none"/>
      </svg>
    ),
  },
  {
    name: 'Dacia',
    svg: (
      <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Dacia">
        <rect x="2" y="2" width="96" height="46" rx="4" fill="#005CA9"/>
        <text x="50" y="33" textAnchor="middle" fontSize="20" fontWeight="900" fill="white" fontFamily="Arial" letterSpacing="2">DACIA</text>
      </svg>
    ),
  },
  {
    name: 'Skoda',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Skoda">
        <circle cx="40" cy="40" r="38" fill="#4BA82E" stroke="#4BA82E"/>
        <circle cx="40" cy="40" r="28" fill="white" stroke="white"/>
        <text x="40" y="48" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4BA82E" fontFamily="Arial">ŠKODA</text>
      </svg>
    ),
  },
];

export default function BrandLogos() {
  return (
    <section
      style={{ background: '#FFFFFF', borderTop: '1px solid #E2E6EA', borderBottom: '1px solid #E2E6EA', padding: '3rem 0', overflow: 'hidden' }}
      aria-label="Desteklenen araç markaları"
    >
      {/* Başlık */}
      <p style={{ textAlign: 'center', color: '#66717C', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.75rem' }}>
        Birçok Marka ve Modele Profesyonel Servis Desteği
      </p>

      {/* Marquee */}
      <div style={{ position: 'relative' }}>
        {/* Sol fade */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to right, #FFFFFF, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        {/* Sağ fade */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to left, #FFFFFF, transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div className="brand-track" aria-hidden="false">
          <div className="brand-scroll">
            {/* İki kopya — kesintisiz döngü */}
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                title={brand.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 20px',
                  background: '#F8F9FA',
                  border: '1px solid #E2E6EA',
                  borderRadius: '12px',
                  flexShrink: 0,
                  width: '96px',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                className="brand-item"
              >
                <div style={{ width: '56px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {brand.svg}
                </div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#66717C', textAlign: 'center', letterSpacing: '0.03em' }}>
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '11px', marginTop: '1.5rem', padding: '0 1rem' }}>
        CLASS AUTO, yukarıda belirtilen markaların yetkili servisi değildir. Bağımsız, profesyonel özel servis hizmeti sunmaktadır.
      </p>

      <style>{`
        .brand-scroll {
          display: flex;
          gap: 12px;
          padding: 4px 0;
          animation: brand-marquee 28s linear infinite;
          width: max-content;
        }
        .brand-scroll:hover { animation-play-state: paused; }
        @keyframes brand-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .brand-item:hover {
          border-color: rgba(227,6,19,0.3) !important;
          background: rgba(227,6,19,0.04) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .brand-scroll { animation: none; }
        }
      `}</style>
    </section>
  );
}
