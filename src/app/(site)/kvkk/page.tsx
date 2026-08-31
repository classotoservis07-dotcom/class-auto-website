import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'KVKK Aydınlatma Metni — CLASS AUTO',
  description: 'CLASS AUTO kişisel verilerin korunması kanunu (KVKK) kapsamında hazırlanmış aydınlatma metni.',
  slug: 'kvkk',
});

const H2: React.CSSProperties = {
  fontFamily: 'Oswald, Arial Narrow, sans-serif',
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#1D252D',
  marginBottom: '10px',
};

export default function KVKKPage() {
  const { brand, address, contact } = SITE_CONFIG;
  return (
    <>
      {/* Başlık */}
      <section style={{ paddingTop: '130px', paddingBottom: '40px', background: '#F5F6F7', borderBottom: '1px solid #E2E6EA' }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#66717C', listStyle: 'none', padding: 0, margin: '0 0 14px' }}>
              <li><Link href="/" style={{ color: '#66717C', textDecoration: 'none' }}>Ana Sayfa</Link></li>
              <li aria-hidden>/</li>
              <li style={{ color: '#1D252D' }}>KVKK Aydınlatma Metni</li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 700, color: '#1D252D', marginBottom: '8px' }}>
            Kişisel Verilerin Korunması<br />Aydınlatma Metni
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Son güncelleme: Ağustos 2026</p>
        </div>
      </section>

      {/* İçerik */}
      <section style={{ background: '#FFFFFF', padding: '4rem 0' }}>
        <div className="container-site" style={{ maxWidth: '760px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: '#66717C', lineHeight: 1.8, fontSize: '15px' }}>

            <div>
              <h2 style={H2}>1. Veri Sorumlusu</h2>
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel verileriniz; veri sorumlusu sıfatıyla{' '}
                <strong style={{ color: '#1D252D' }}>{brand.name}</strong> tarafından aşağıda açıklanan kapsamda işlenecektir.
              </p>
              <ul style={{ marginTop: '10px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                <li><strong style={{ color: '#1D252D' }}>Adres:</strong> {address.full}</li>
                {contact.email !== 'ONAY_BEKLIYOR' && (
                  <li><strong style={{ color: '#1D252D' }}>E-posta:</strong> {contact.email}</li>
                )}
              </ul>
            </div>

            <div>
              <h2 style={H2}>2. İşlenen Kişisel Veriler</h2>
              <p>Web sitemizdeki iletişim formu aracılığıyla aşağıdaki kişisel veriler işlenebilmektedir:</p>
              <ul style={{ marginTop: '10px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                <li>Ad ve soyad</li>
                <li>Telefon numarası</li>
                <li>Araç bilgileri (marka, model, plaka)</li>
                <li>Talebiniz ve mesajınız</li>
              </ul>
            </div>

            <div>
              <h2 style={H2}>3. İşleme Amaçları ve Hukuki Dayanaklar</h2>
              <p>Kişisel verileriniz aşağıdaki amaçlarla ve hukuki dayanaklara göre işlenmektedir:</p>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Randevu ve iletişim taleplerinin yönetimi:', val: 'Sözleşmenin kurulması veya ifası (KVKK m.5/2-c)' },
                  { label: 'Müşteri hizmetleri:', val: 'Meşru menfaat (KVKK m.5/2-f)' },
                  { label: 'Yasal yükümlülükler:', val: 'Hukuki yükümlülüğün yerine getirilmesi (KVKK m.5/2-ç)' },
                ].map((item) => (
                  <div key={item.label} style={{ background: '#F5F6F7', border: '1px solid #E2E6EA', borderRadius: '8px', padding: '12px 16px', fontSize: '14px' }}>
                    <strong style={{ color: '#1D252D' }}>{item.label}</strong> {item.val}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 style={H2}>4. Kişisel Verilerin Aktarılması</h2>
              <p>Kişisel verileriniz; talep ettiğiniz hizmetin yerine getirilmesi amacıyla servis ekibimizle paylaşılabilir. Üçüncü taraflara, reklam firmalarına veya yurt dışına aktarılmamaktadır.</p>
            </div>

            <div>
              <h2 style={H2}>5. Saklama Süresi</h2>
              <p>Kişisel verileriniz, hizmet talebinizin karşılanması amacıyla işlendikten sonra yasal saklama süreleri kapsamında muhafaza edilecek, akabinde güvenli biçimde silinecek veya anonimleştirilecektir.</p>
            </div>

            <div>
              <h2 style={H2}>6. Veri Sahibi Hakları</h2>
              <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
              <ul style={{ marginTop: '10px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
                <li>Silinmesini veya yok edilmesini isteme</li>
                <li>İşlenen verilerin otomatik sistemlerle analiz edilmesi suretiyle aleyhine sonuç çıkmasına itiraz etme</li>
                <li>Kanuna aykırı işlenmesi sebebiyle zarara uğranması hâlinde zararın giderilmesini talep etme</li>
              </ul>
              <p style={{ marginTop: '12px', fontSize: '14px' }}>
                Haklarınızı kullanmak için{' '}
                <Link href="/iletisim" style={{ color: '#E30613', textDecoration: 'underline' }}>iletişim sayfamızdaki formu</Link>{' '}
                kullanabilir veya yukarıda belirtilen adresimize yazılı başvuruda bulunabilirsiniz.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E6EA', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/iletisim" className="btn-secondary" style={{ borderColor: '#E2E6EA', color: '#1D252D', fontSize: '14px' }}>← İletişim Sayfasına Dön</Link>
            <Link href="/gizlilik" className="btn-secondary" style={{ borderColor: '#E2E6EA', color: '#1D252D', fontSize: '14px' }}>Gizlilik Politikası</Link>
          </div>
        </div>
      </section>
    </>
  );
}
