import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hakkımızda — CLASS AUTO Antalya Oto Servis',
  description:
    "CLASS AUTO hakkında bilgi edinin. Antalya Muratpaşa Güzeloba'da profesyonel oto servis hizmetleri sunan ekibimizle tanışın.",
  slug: 'hakkimizda',
});

const VALUES = [
  {
    title: 'Şeffaflık',
    desc: 'Her işlem öncesi bilgilendirme ve onay. Sürpriz fatura yok.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    title: 'Kalite',
    desc: 'Güvenilir parçalar ve titiz işçilik anlayışıyla kalıcı çözümler.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: 'Güvenilirlik',
    desc: 'Söz verilen sürede, söz verilen kalitede teslim. Her zaman.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    title: 'Uzman Ekip',
    desc: 'Alanında deneyimli, sürekli kendini geliştiren teknisyenler.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: 'Modern Ekipman',
    desc: 'Güncel OBD2 ve bilgisayarlı teşhis sistemleriyle hızlı arıza tespiti.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>
      </svg>
    ),
  },
  {
    title: 'Tüm Markalar',
    desc: 'Yerli ve yabancı tüm marka ve model araçlara kapsamlı servis.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Sayfa başlığı ── */}
      <section style={{ paddingTop: '130px', paddingBottom: '48px', background: '#F5F6F7', borderBottom: '1px solid #E2E6EA' }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#66717C', listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
              <li><Link href="/" style={{ color: '#66717C', textDecoration: 'none' }}>Ana Sayfa</Link></li>
              <li aria-hidden>/</li>
              <li style={{ color: '#1D252D', fontWeight: 600 }}>Hakkımızda</li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: 'clamp(1.75rem,4vw,2.75rem)', fontWeight: 700, color: '#1D252D', marginBottom: '12px' }}>
            <span style={{ color: '#E30613' }}>CLASS AUTO</span> Hakkında
          </h1>
          <p style={{ color: '#66717C', fontSize: '1.0625rem', maxWidth: '600px', margin: 0 }}>
            Antalya Muratpaşa Güzeloba&apos;da faaliyet gösteren CLASS AUTO, aracınızın tüm bakım ve onarım ihtiyaçlarına profesyonel çözüm üretmektedir.
          </p>
        </div>
      </section>

      {/* ── Kimiz / Misyon ── */}
      <section style={{ background: '#FFFFFF', padding: '4rem 0' }}>
        <div className="container-site" style={{ maxWidth: '900px' }}>
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div>
              <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#1D252D', marginBottom: '14px' }}>
                Kimiz?
              </h2>
              <p style={{ color: '#66717C', lineHeight: 1.8, marginBottom: '12px' }}>
                CLASS AUTO, Antalya&apos;nın Muratpaşa ilçesi Güzeloba Mahallesi&apos;nde hizmet veren bağımsız bir oto servis merkezidir. Shell Petrol istasyonunun yanında konumlanan servisimiz, her marka ve model araca profesyonel bakım ve onarım hizmeti sunmaktadır.
              </p>
              <p style={{ color: '#66717C', lineHeight: 1.8 }}>
                Müşteri memnuniyetini ön planda tutan yaklaşımımız, şeffaf fiyatlandırma ilkemiz ve kaliteli işçilik anlayışımızla her araca sahibi gibi özen gösteriyoruz.
              </p>
            </div>
            <div>
              <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#1D252D', marginBottom: '14px' }}>
                Misyonumuz
              </h2>
              <p style={{ color: '#66717C', lineHeight: 1.8, marginBottom: '12px' }}>
                Araç sahiplerinin güvenle başvurabileceği, dürüst ve şeffaf çalışma anlayışıyla aracı teslim aldığı gibi iade eden bir servis olmak.
              </p>
              <p style={{ color: '#66717C', lineHeight: 1.8 }}>
                Her işlem öncesinde müşteriyi bilgilendiriyor, onayını alıyoruz. Söz verdiğimiz sürede, söz verdiğimiz kalitede teslim ediyoruz.
              </p>
            </div>
          </div>

          {/* Değerlerimiz */}
          <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#1D252D', marginBottom: '20px', textAlign: 'center' }}>
            Çalışma <span style={{ color: '#E30613' }}>Prensiplerimiz</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {VALUES.map((v) => (
              <div key={v.title} style={{
                background: '#F5F6F7', border: '1px solid #E2E6EA',
                borderRadius: '12px', padding: '20px',
              }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(227,6,19,0.08)', border: '1px solid rgba(227,6,19,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E30613', marginBottom: '14px' }}>
                  {v.icon}
                </div>
                <h3 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontWeight: 700, color: '#1D252D', marginBottom: '6px' }}>{v.title}</h3>
                <p style={{ color: '#66717C', fontSize: '14px', lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>

          {/* İletişim Bilgileri */}
          <div style={{ background: '#F5F6F7', border: '1px solid #E2E6EA', borderRadius: '14px', padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#1D252D', marginBottom: '20px' }}>
              İletişim Bilgilerimiz
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p style={{ color: '#1D252D', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Adres</p>
                  <p style={{ color: '#66717C', fontSize: '14px' }}>{SITE_CONFIG.address.full}</p>
                  <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '2px' }}>{SITE_CONFIG.address.landmark}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                  <p style={{ color: '#1D252D', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Çalışma Saatleri</p>
                  <p style={{ color: '#66717C', fontSize: '14px' }}>{SITE_CONFIG.workingHours.weekdays}</p>
                  <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '2px' }}>Pazar: Kapalı</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <Link href="/iletisim" className="btn-primary">Randevu Al</Link>
            <Link href="/hizmetler" className="btn-secondary" style={{ borderColor: '#E2E6EA', color: '#1D252D' }}>Hizmetleri İncele</Link>
          </div>
        </div>
      </section>
    </>
  );
}
