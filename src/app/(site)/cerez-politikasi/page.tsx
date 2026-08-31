import type { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Çerez Politikası — CLASS AUTO',
  description: 'CLASS AUTO web sitesi çerez politikası. Hangi çerezler kullanılır ve nasıl kontrol edebilirsiniz.',
  slug: 'cerez-politikasi',
});

const H2: React.CSSProperties = {
  fontFamily: 'Oswald, Arial Narrow, sans-serif',
  fontSize: '1.2rem',
  fontWeight: 700,
  color: '#1D252D',
  marginBottom: '10px',
};

export default function CerezPage() {
  return (
    <>
      {/* Başlık */}
      <section style={{ paddingTop: '130px', paddingBottom: '40px', background: '#F5F6F7', borderBottom: '1px solid #E2E6EA' }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#66717C', listStyle: 'none', padding: 0, margin: '0 0 14px' }}>
              <li><Link href="/" style={{ color: '#66717C', textDecoration: 'none' }}>Ana Sayfa</Link></li>
              <li aria-hidden>/</li>
              <li style={{ color: '#1D252D' }}>Çerez Politikası</li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 700, color: '#1D252D', marginBottom: '8px' }}>
            Çerez Politikası
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Son güncelleme: Ağustos 2026</p>
        </div>
      </section>

      {/* İçerik */}
      <section style={{ background: '#FFFFFF', padding: '4rem 0' }}>
        <div className="container-site" style={{ maxWidth: '760px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: '#66717C', lineHeight: 1.8 }}>

            <div>
              <h2 style={H2}>Çerez Nedir?</h2>
              <p>Çerezler, web sitelerinin tarayıcınıza yerleştirdiği küçük metin dosyalarıdır. Sitenin düzgün çalışmasını sağlamak ve kullanıcı deneyimini geliştirmek amacıyla kullanılır.</p>
            </div>

            <div>
              <h2 style={H2}>Hangi Çerezleri Kullanıyoruz?</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                {[
                  { title: 'Zorunlu Çerezler', desc: 'Sitenin temel işlevleri için gereklidir. Devre dışı bırakılamaz.' },
                  { title: 'Analitik Çerezler (Onay Bekliyor)', desc: 'Sitenin nasıl kullanıldığını anlamak için kullanılır (Google Analytics). Bu çerezler yalnızca kullanıcı onayıyla aktive edilecektir.' },
                  { title: 'Pazarlama Çerezleri (Onay Bekliyor)', desc: 'Reklam optimizasyonu için kullanılabilir (Meta Pixel, Google Ads). Yalnızca işletme sahibi onayıyla aktive edilecektir.' },
                ].map((item) => (
                  <div key={item.title} style={{ background: '#F5F6F7', border: '1px solid #E2E6EA', borderRadius: '10px', padding: '14px 18px' }}>
                    <p style={{ color: '#1D252D', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{item.title}</p>
                    <p style={{ fontSize: '14px' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 style={H2}>Çerezleri Nasıl Kontrol Edebilirsiniz?</h2>
              <p>Tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz. Ancak bu işlem sitenin bazı özelliklerini etkileyebilir.</p>
              <ul style={{ marginTop: '10px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                <li>Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                <li>Firefox: Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
                <li>Safari: Tercihler → Gizlilik → Çerezleri Engelle</li>
                <li>Edge: Ayarlar → Çerezler ve site izinleri</li>
              </ul>
            </div>

            <div>
              <h2 style={H2}>İletişim</h2>
              <p>
                Çerez politikasıyla ilgili sorularınız için{' '}
                <Link href="/iletisim" style={{ color: '#E30613', textDecoration: 'underline' }}>iletişim sayfamız</Link>{' '}
                üzerinden bize ulaşabilirsiniz.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E6EA', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/gizlilik" className="btn-secondary" style={{ borderColor: '#E2E6EA', color: '#1D252D', fontSize: '14px' }}>Gizlilik Politikası</Link>
            <Link href="/kvkk" className="btn-secondary" style={{ borderColor: '#E2E6EA', color: '#1D252D', fontSize: '14px' }}>KVKK Metni</Link>
          </div>
        </div>
      </section>
    </>
  );
}
