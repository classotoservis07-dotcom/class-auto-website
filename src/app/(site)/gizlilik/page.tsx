import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Gizlilik Politikası — CLASS AUTO',
  description: 'CLASS AUTO web sitesi gizlilik politikası. Kişisel verileriniz nasıl işlenir, korunur ve ne amaçla kullanılır.',
  slug: 'gizlilik',
});

const H2: React.CSSProperties = {
  fontFamily: 'Oswald, Arial Narrow, sans-serif',
  fontSize: '1.2rem',
  fontWeight: 700,
  color: '#1D252D',
  marginBottom: '10px',
};

export default function GizlilikPage() {
  const { brand } = SITE_CONFIG;
  return (
    <>
      {/* Başlık */}
      <section style={{ paddingTop: '130px', paddingBottom: '40px', background: '#F5F6F7', borderBottom: '1px solid #E2E6EA' }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#66717C', listStyle: 'none', padding: 0, margin: '0 0 14px' }}>
              <li><Link href="/" style={{ color: '#66717C', textDecoration: 'none' }}>Ana Sayfa</Link></li>
              <li aria-hidden>/</li>
              <li style={{ color: '#1D252D' }}>Gizlilik Politikası</li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 700, color: '#1D252D', marginBottom: '8px' }}>
            Gizlilik Politikası
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Son güncelleme: Ağustos 2026</p>
        </div>
      </section>

      {/* İçerik */}
      <section style={{ background: '#FFFFFF', padding: '4rem 0' }}>
        <div className="container-site" style={{ maxWidth: '760px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: '#66717C', lineHeight: 1.8 }}>

            <div>
              <h2 style={H2}>Genel Bilgiler</h2>
              <p>
                Bu gizlilik politikası, <strong style={{ color: '#1D252D' }}>{brand.name}</strong> web sitesinin kullanıcı verilerini nasıl topladığını, kullandığını ve koruduğunu açıklamaktadır.
              </p>
            </div>

            <div>
              <h2 style={H2}>Toplanan Bilgiler</h2>
              <p>Web sitemizi kullandığınızda şu tür bilgiler toplanabilir:</p>
              <ul style={{ marginTop: '10px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                <li>İletişim formu aracılığıyla gönüllü olarak paylaştığınız bilgiler (ad, telefon, araç bilgileri)</li>
                <li>Teknik veriler (tarayıcı türü, IP adresi — yalnız güvenlik ve analiz amaçlı)</li>
                <li>Çerezler aracılığıyla toplanan kullanım verileri (bkz. Çerez Politikası)</li>
              </ul>
            </div>

            <div>
              <h2 style={H2}>Bilgilerin Kullanımı</h2>
              <p>Toplanan bilgiler yalnızca şu amaçlarla kullanılır:</p>
              <ul style={{ marginTop: '10px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                <li>Randevu ve iletişim taleplerinizi yanıtlamak</li>
                <li>Hizmet kalitemizi geliştirmek</li>
                <li>Yasal yükümlülüklerimizi yerine getirmek</li>
              </ul>
            </div>

            <div>
              <h2 style={H2}>Üçüncü Taraflarla Paylaşım</h2>
              <p>Kişisel verileriniz; yasal zorunluluklar dışında, reklam firmalarına, veri aracılarına veya herhangi bir üçüncü tarafa satılmaz, kiralanmaz veya paylaşılmaz.</p>
            </div>

            <div>
              <h2 style={H2}>Veri Güvenliği</h2>
              <p>Web sitemiz HTTPS protokolüyle şifrelenerek sunulmaktadır. Formlar sunucu tarafında işlenerek istemci tarafında hassas bilgi saklanmamaktadır.</p>
            </div>

            <div>
              <h2 style={H2}>Haklarınız</h2>
              <p>
                Verilerinize erişim, düzeltme veya silme talepleriniz için{' '}
                <Link href="/iletisim" style={{ color: '#E30613', textDecoration: 'underline' }}>iletişim sayfamız</Link>{' '}
                üzerinden bize ulaşabilirsiniz.
              </p>
            </div>

            <div>
              <h2 style={H2}>Politika Güncellemeleri</h2>
              <p>Bu politika gerektiğinde güncellenebilir. Önemli değişiklikler sitenin ana sayfasında duyurulacaktır.</p>
            </div>
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E6EA', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/kvkk" className="btn-secondary" style={{ borderColor: '#E2E6EA', color: '#1D252D', fontSize: '14px' }}>KVKK Metni</Link>
            <Link href="/cerez-politikasi" className="btn-secondary" style={{ borderColor: '#E2E6EA', color: '#1D252D', fontSize: '14px' }}>Çerez Politikası</Link>
          </div>
        </div>
      </section>
    </>
  );
}
