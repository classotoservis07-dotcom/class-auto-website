'use client';

/**
 * BrandLogos — Güncel resmi araç marka logolarını SVG inline olarak gösterir.
 * Marquee animasyonu ile sonsuz döngü.
 */

const BRANDS = [
  {
    name: 'BMW',
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="BMW">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#1C69D4" strokeWidth="4"/>
        <circle cx="50" cy="50" r="36" fill="#1C69D4"/>
        {/* BMW 4 quadrants */}
        <path d="M50 14 A36 36 0 0 1 86 50 L50 50 Z" fill="white"/>
        <path d="M50 86 A36 36 0 0 1 14 50 L50 50 Z" fill="white"/>
        <circle cx="50" cy="50" r="36" fill="none" stroke="white" strokeWidth="2"/>
        {/* BMW text ring */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="#1C69D4" strokeWidth="4"/>
        <text x="50" y="54" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1C69D4" fontFamily="Arial, sans-serif" letterSpacing="1">BMW</text>
      </svg>
    ),
  },
  {
    name: 'Mercedes',
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mercedes-Benz">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#222" strokeWidth="3"/>
        {/* Three-pointed star */}
        <path d="M50 16 L50 50 L76 67" stroke="#222" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M50 50 L24 67" stroke="#222" strokeWidth="3.5" strokeLinecap="round"/>
        {/* Outer ring at star tips */}
        <circle cx="50" cy="16" r="4" fill="#222"/>
        <circle cx="76" cy="67" r="4" fill="#222"/>
        <circle cx="24" cy="67" r="4" fill="#222"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#222" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    name: 'Audi',
    svg: (
      <svg viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Audi">
        <circle cx="22" cy="30" r="19" stroke="#333" strokeWidth="3.5" fill="none"/>
        <circle cx="54" cy="30" r="19" stroke="#333" strokeWidth="3.5" fill="none"/>
        <circle cx="86" cy="30" r="19" stroke="#333" strokeWidth="3.5" fill="none"/>
        <circle cx="118" cy="30" r="19" stroke="#333" strokeWidth="3.5" fill="none"/>
      </svg>
    ),
  },
  {
    name: 'Volkswagen',
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Volkswagen">
        <circle cx="50" cy="50" r="48" fill="#001E50"/>
        {/* VW logo 2019+ simplified */}
        {/* Top V */}
        <path d="M32 28 L50 62 L68 28" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {/* Bottom W - simplified */}
        <path d="M26 42 L38 70 L50 50 L62 70 L74 42" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    name: 'Toyota',
    svg: (
      <svg viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Toyota">
        {/* Toyota 3 overlapping ovals */}
        {/* Left oval (vertical) */}
        <ellipse cx="52" cy="35" rx="14" ry="32" stroke="#EB0A1E" strokeWidth="4.5" fill="none"/>
        {/* Right oval (vertical) */}
        <ellipse cx="88" cy="35" rx="14" ry="32" stroke="#EB0A1E" strokeWidth="4.5" fill="none"/>
        {/* Horizontal oval */}
        <ellipse cx="70" cy="35" rx="36" ry="17" stroke="#EB0A1E" strokeWidth="4.5" fill="none"/>
      </svg>
    ),
  },
  {
    name: 'Ford',
    svg: (
      <svg viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Ford">
        <ellipse cx="70" cy="35" rx="66" ry="31" fill="#003478"/>
        <ellipse cx="70" cy="35" rx="64" ry="29" fill="none" stroke="#7EC8E3" strokeWidth="1.5"/>
        <text x="70" y="46" textAnchor="middle" fontSize="30" fontWeight="bold" fill="white" fontFamily="'Times New Roman', Georgia, serif" fontStyle="italic" letterSpacing="-1">Ford</text>
      </svg>
    ),
  },
  {
    name: 'Renault',
    svg: (
      <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Renault">
        {/* New 2021 Renault diamond */}
        <path d="M40 5 L75 25 L75 75 L40 95 L5 75 L5 25 Z" fill="none" stroke="#EFCD00" strokeWidth="5" strokeLinejoin="round"/>
        <path d="M40 18 L64 32 L64 68 L40 82 L16 68 L16 32 Z" fill="none" stroke="#EFCD00" strokeWidth="4" strokeLinejoin="round"/>
        {/* Inner diamond shape */}
        <path d="M40 28 L56 50 L40 72 L24 50 Z" fill="#EFCD00"/>
      </svg>
    ),
  },
  {
    name: 'Peugeot',
    svg: (
      <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Peugeot">
        {/* Peugeot 2021 shield with lion */}
        {/* Shield shape */}
        <path d="M40 4 L76 18 L76 60 Q76 88 40 97 Q4 88 4 60 L4 18 Z" fill="#1A1A1A" stroke="#1A1A1A"/>
        {/* Simplified lion silhouette (2021 Peugeot) */}
        {/* Body */}
        <ellipse cx="40" cy="58" rx="14" ry="16" fill="white"/>
        {/* Head */}
        <circle cx="40" cy="36" r="12" fill="white"/>
        {/* Crown/mane */}
        <path d="M28 30 Q26 20 32 18 Q36 28 40 26 Q44 28 48 18 Q54 20 52 30" fill="white" stroke="white" strokeWidth="1"/>
        {/* Face details */}
        <circle cx="36" cy="34" r="1.5" fill="#1A1A1A"/>
        <circle cx="44" cy="34" r="1.5" fill="#1A1A1A"/>
        <path d="M37 39 Q40 42 43 39" stroke="#1A1A1A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Tail */}
        <path d="M54 60 Q64 56 66 50 Q68 44 62 42" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        {/* Legs */}
        <rect x="30" y="68" width="8" height="16" rx="4" fill="white"/>
        <rect x="42" y="68" width="8" height="16" rx="4" fill="white"/>
      </svg>
    ),
  },
  {
    name: 'Fiat',
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Fiat">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#C41E3A" strokeWidth="4"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#C41E3A" strokeWidth="2"/>
        {/* FIAT text - official bold style */}
        <text x="50" y="43" textAnchor="middle" fontSize="9" fontWeight="800" fill="#C41E3A" fontFamily="Arial, sans-serif" letterSpacing="1">FIAT</text>
        {/* Horizontal line below */}
        <line x1="22" y1="50" x2="78" y2="50" stroke="#C41E3A" strokeWidth="1.5"/>
        {/* 124 style shield element */}
        <path d="M38 56 L50 58 L62 56 L62 70 L50 76 L38 70 Z" fill="#C41E3A"/>
        <text x="50" y="67" textAnchor="middle" fontSize="7" fontWeight="700" fill="white" fontFamily="Arial, sans-serif">FIAT</text>
      </svg>
    ),
  },
  {
    name: 'Hyundai',
    svg: (
      <svg viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Hyundai">
        <ellipse cx="70" cy="35" rx="66" ry="31" fill="#002C5F"/>
        {/* H logo - Hyundai style italic H */}
        <path d="M40 18 L40 52" stroke="white" strokeWidth="6" strokeLinecap="round"/>
        <path d="M100 18 L100 52" stroke="white" strokeWidth="6" strokeLinecap="round"/>
        {/* Diagonal crossbar (Hyundai H is slightly italic/connected) */}
        <path d="M40 38 Q70 28 100 38" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    name: 'Kia',
    svg: (
      <svg viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Kia">
        {/* Kia 2021 oval with new signature */}
        <ellipse cx="80" cy="30" rx="76" ry="26" fill="#BB162B"/>
        {/* New KIA signature - angular geometric style */}
        {/* K */}
        <path d="M28 18 L28 42" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <path d="M28 30 L44 18" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <path d="M28 30 L44 42" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        {/* I */}
        <path d="M58 18 L70 18" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <path d="M64 18 L64 42" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <path d="M58 42 L70 42" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        {/* A */}
        <path d="M82 42 L96 18 L110 42" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M86 34 L106 34" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Opel',
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Opel">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#FFD700" strokeWidth="5"/>
        <circle cx="50" cy="50" r="34" fill="none" stroke="#333" strokeWidth="3"/>
        {/* Opel lightning bolt */}
        <path d="M56 20 L36 50 L48 50 L44 80 L64 50 L52 50 Z" fill="#FFD700" stroke="#333" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Honda',
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Honda">
        <rect x="2" y="18" width="96" height="64" rx="6" fill="#CC0000"/>
        {/* Honda H logo */}
        <path d="M28 28 L28 72" stroke="white" strokeWidth="7" strokeLinecap="round"/>
        <path d="M72 28 L72 72" stroke="white" strokeWidth="7" strokeLinecap="round"/>
        <path d="M28 50 L72 50" stroke="white" strokeWidth="6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Volvo',
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Volvo">
        <circle cx="50" cy="55" r="42" fill="none" stroke="#003057" strokeWidth="5"/>
        {/* Arrow top-right */}
        <path d="M78 18 L96 2" stroke="#003057" strokeWidth="4" strokeLinecap="round"/>
        <path d="M82 2 L96 2 L96 16" stroke="#003057" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <text x="50" y="62" textAnchor="middle" fontSize="13" fontWeight="700" fill="#003057" fontFamily="Arial, sans-serif" letterSpacing="2">VOLVO</text>
      </svg>
    ),
  },
  {
    name: 'Citroën',
    svg: (
      <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Citroën">
        <rect x="2" y="2" width="116" height="76" rx="5" fill="#8B0000"/>
        {/* Citroën double chevron */}
        <path d="M26 26 Q60 14 94 26" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M26 42 Q60 30 94 42" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M26 54 Q60 42 94 54" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Dacia',
    svg: (
      <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Dacia">
        <rect x="2" y="2" width="116" height="66" rx="5" fill="#005CA9"/>
        {/* Dacia new 2022 logo - angular mountain/D shape */}
        <path d="M26 52 L44 20 L60 20 L60 52 Z" fill="white"/>
        <path d="M60 20 L60 52 L82 52 Q94 52 94 36 Q94 20 82 20 Z" fill="white"/>
        {/* D hole */}
        <path d="M68 28 L68 44 Q80 44 80 36 Q80 28 68 28 Z" fill="#005CA9"/>
      </svg>
    ),
  },
  {
    name: 'Škoda',
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Škoda">
        <circle cx="50" cy="50" r="48" fill="#4BA82E"/>
        <circle cx="50" cy="50" r="36" fill="white"/>
        {/* Škoda winged arrow logo */}
        {/* Arrow pointing right */}
        <path d="M24 50 L60 34 L52 50 L60 66 Z" fill="#4BA82E"/>
        {/* Wing top */}
        <path d="M52 34 L76 28 L68 40 L52 40 Z" fill="#4BA82E"/>
        {/* Wing bottom */}
        <path d="M52 60 L76 72 L68 60 L52 60 Z" fill="#4BA82E"/>
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
