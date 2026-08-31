import { SERVICES } from '@/lib/config';
import { getSiteSettings } from '@/lib/site-settings';
import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// ── Hizmet içerikleri (benzersiz H1, açıklama, özellikler) ──────────────────

const SERVICE_DATA: Record<string, {
  h1: string;
  longDesc: string[];
  features: string[];
  faq: { q: string; a: string }[];
  cta: string;
}> = {
  'periyodik-bakim': {
    h1: "Antalya'da Periyodik Bakım Hizmeti",
    longDesc: [
      "Aracınızın uzun ömürlü ve güvenli kalması için düzenli periyodik bakım şarttır. CLASS AUTO olarak, üreticinin önerdiği bakım aralıklarını takip ederek aracınızı en iyi performansta tutuyoruz.",
      "Motor yağı değişiminden filtre kontrolüne, fren sisteminden aydınlatmaya kadar kapsamlı periyodik bakım hizmeti sunuyoruz. Her marka ve model araca uygun bakım programı uyguluyoruz.",
    ],
    features: [
      'Motor yağı ve yağ filtresi değişimi',
      'Hava filtresi kontrolü ve değişimi',
      'Polen filtresi değişimi',
      'Yakıt filtresi kontrolü',
      'Bujilerin kontrolü ve değişimi',
      'Fren sistemi kontrolü',
      'Soğutma sıvısı kontrolü',
      'Akü testi',
      'Lastik basıncı kontrolü',
      'Tüm sıvı seviyeleri kontrolü',
      'Aydınlatma sistemi kontrolü',
      'Genel araç güvenlik kontrolü',
    ],
    faq: [
      { q: 'Periyodik bakım ne sıklıkla yapılmalı?', a: 'Genel olarak her 10.000–15.000 km\'de veya yılda bir kez bakım önerilir. Aracınızın marka ve modeline göre bu aralık değişebilir.' },
      { q: 'Periyodik bakımda neler değiştirilir?', a: 'Motor yağı, yağ filtresi, hava filtresi, polen filtresi ve gerekirse buji değişimi yapılır. Fren sistemi, lastikler ve tüm sıvı seviyeleri kontrol edilir.' },
      { q: 'Periyodik bakım ne kadar sürer?', a: 'Standart periyodik bakım genellikle 1–2 saat içinde tamamlanır.' },
    ],
    cta: 'Periyodik Bakım Randevusu Al',
  },

  'mekanik-bakim': {
    h1: 'Antalya Mekanik Bakım ve Onarım',
    longDesc: [
      'Aracınızın mekanik sistemi, tüm bileşenlerin uyum içinde çalışmasını sağlayan temel unsurdur. CLASS AUTO olarak, her marka ve model araca uzman teknisyenlerimizle mekanik bakım ve onarım hizmeti sunuyoruz.',
      'Periyodik bakımdan motor revizyonuna, fren sisteminden süspansiyona kadar geniş bir yelpazede teknik destek sağlıyoruz. Her işlemde kaliteli yedek parça kullanarak uzun ömürlü çözümler üretiyoruz.',
    ],
    features: [
      'Periyodik bakım (yağ, filtre, buji)',
      'Motor arıza tespiti ve onarımı',
      'Şanzıman bakımı ve onarımı',
      'Fren sistemi kontrolü ve değişimi',
      'Süspansiyon ve direksiyon sistemleri',
      'Soğutma sistemi bakımı',
      'Debriyaj değişimi',
      'Egzoz sistemi onarımı',
    ],
    faq: [
      { q: 'Mekanik arıza belirtileri nelerdir?', a: 'Motor sesi değişimi, titreşim, fren performansı düşüklüğü, güç kaybı ve yağ tüketimindeki artış mekanik arıza belirtileri olabilir.' },
      { q: 'Orijinal parça mı kullanılıyor?', a: 'Evet, tüm onarımlarımızda OEM veya eşdeğer kaliteli yedek parçalar kullanıyoruz.' },
    ],
    cta: 'Mekanik Bakım Randevusu Al',
  },

  'oto-elektrik': {
    h1: 'Antalya Oto Elektrik Arıza Tespiti',
    longDesc: [
      'Modern araçlarda elektronik sistemler giderek daha karmaşık hale gelmektedir. Akü, alternatör, marş motoru, sensörler ve araç içi elektroniklerin doğru teşhisi için profesyonel ekipman ve uzman bilgisi gerekmektedir.',
      'CLASS AUTO elektrik atölyemizde güncel test cihazlarıyla arızayı kaynağında tespit ediyor, doğru ve kalıcı çözüm sunuyoruz.',
    ],
    features: [
      'Akü testi ve değişimi',
      'Alternatör ve marş onarımı',
      'Aydınlatma ve sinyal sistemleri',
      'Araç içi eğlence sistemi arızaları',
      'Klima elektrik sistemi',
      'Sensör ve aktüatör değişimi',
      'Kablo demeti onarımı',
      'CAN bus arıza tespiti',
    ],
    faq: [
      { q: 'Akü ne zaman değiştirilmeli?', a: 'Ortalama 3–5 yılda bir veya akü testi sonucu zayıf kapasitesi görüldüğünde değiştirilmesi önerilir.' },
      { q: 'Araçtaki uyarı ışığı için ne yapmalıyım?', a: 'Gösterge panelinde yanan herhangi bir uyarı ışığında en kısa sürede OBD taraması yaptırmanızı öneririz.' },
    ],
    cta: 'Elektrik Arızası Randevusu Al',
  },

  'ariza-tespit': {
    h1: 'Antalya Bilgisayarlı Arıza Tespiti',
    longDesc: [
      'Modern araçlarda motor, şanzıman, ABS, ESC, hava yastığı ve onlarca başka sistem sürekli olarak elektronik kontrol ünitesi (ECU) tarafından izlenir. Herhangi bir sorun oluştuğunda gösterge panelinde uyarı ışıkları devreye girer.',
      'CLASS AUTO arıza tespit servisinde güncel OBD-II cihazları ve kapsamlı teşhis yazılımları kullanılarak hata kodları okunur, yorumlanır ve çözüm yolu belirlenir.',
    ],
    features: [
      'OBD-II hata kodu okuma',
      'Motor ECU analizi',
      'ABS / ESC / hava yastığı tanılaması',
      'Şanzıman kontrolü',
      'Klima sistem taraması',
      'Adaptasyon ve sıfırlama işlemleri',
      'Canlı veri akışı analizi',
      'Kapsamlı araç raporu',
    ],
    faq: [
      { q: 'Bilgisayarlı arıza tespiti ne kadar sürer?', a: 'OBD-II taraması genellikle 15–30 dakika içinde tamamlanır. Kapsamlı analiz için ek süre gerekebilir.' },
      { q: 'Hangi araçlarda arıza tespiti yapılabilir?', a: '1996 sonrası üretilen OBD-II uyumlu tüm araçlarda bilgisayarlı arıza tespiti yapabiliyoruz.' },
    ],
    cta: 'Arıza Tespiti Randevusu Al',
  },

  'kaporta-boya': {
    h1: 'Antalya Kaporta ve Boya Hizmetleri',
    longDesc: [
      'Kaza hasarı, çarpma veya zamanın etkisiyle bozulan kaporta ve boya, aracınızın hem görünümünü hem değerini olumsuz etkiler. Profesyonel kaporta ve boya servisi, aracınızı fabrika çıkışındaki görünümüne kavuşturur.',
      'CLASS AUTO kaporta atölyemizde hasar tespitinden boya uygulamasına kadar tüm süreç titizlikle yönetilmektedir. Renk eşleştirme teknolojimizle orijinal renge en yakın sonucu elde ediyoruz.',
    ],
    features: [
      'Kaza hasarı onarımı',
      'Kaporta düzleştirme',
      'Boya öncesi yüzey hazırlığı',
      'Fabrika renk eşleştirme',
      'Tam veya parçalı boya',
      'Pas giderme ve antikorrozyon',
      'Far ve stop restorasyon',
      'Plastik aksam boyama',
    ],
    faq: [
      { q: 'Kaporta boya işlemi ne kadar sürer?', a: 'Hasarın büyüklüğüne göre küçük onarımlar 1–2 gün, kapsamlı kaporta-boya işlemleri 3–5 gün içinde tamamlanır.' },
      { q: 'Sigorta hasarı için kaporta servis yapıyor musunuz?', a: 'Evet, sigorta eksper raporuyla birlikte gelen araçlar için gerekli belgeler konusunda size yardımcı oluyoruz.' },
    ],
    cta: 'Kaporta Boya Randevusu Al',
  },

  'boyasiz-gocuk-duzeltme': {
    h1: 'Boyasız Göçük Düzeltme — Antalya',
    longDesc: [
      'PDR (Paintless Dent Repair) yöntemi, aracınızın boyasına dokunmadan, özel aletlerle göçüklerin düzeltilmesini sağlar. Bu teknik özellikle dolu hasarı, küçük çarpma izleri ve park hasarları için idealdir.',
      'Boyasız göçük düzeltme, geleneksel kaporta-boya işlemine göre hem daha hızlı hem de daha ekonomik bir çözümdür. Aracınızın orijinal boyası ve değeri korunur.',
    ],
    features: [
      'Dolu hasarı onarımı',
      'Ufak çarpma izleri',
      'Park hasarları',
      'Kapı kenarı çizikleri',
      'Kaporta göçükleri',
      'Tavan göçükleri',
      'Boya hasarsız onarım',
      'Hızlı teslimat',
    ],
    faq: [
      { q: 'Boyasız göçük düzeltme her göçükte işe yarar mı?', a: 'PDR yöntemi, boyanın hasar görmediği küçük ve orta büyüklükteki göçüklerde etkilidir. Boyası kalmış veya büyük hasarlar için klasik kaporta yöntemi uygulanır.' },
      { q: 'Boyasız göçük düzeltme ne kadar sürer?', a: 'Küçük göçükler birkaç saat içinde tamamlanabilir. Dolu hasarı gibi yaygın hasarlar 1–2 gün sürebilir.' },
    ],
    cta: 'Boyasız Göçük Randevusu Al',
  },

  'klima-bakimi': {
    h1: 'Antalya Araç Klima Bakım ve Gaz Dolumu',
    longDesc: [
      'Araç kliması, özellikle sıcak yaz aylarında sürüş konforunu doğrudan etkiler. Zamanla azalan soğutma performansı, kaçak veya kirlenmiş filtreler klimanın verimliliğini düşürür.',
      'CLASS AUTO klima bakım servisinde kapsamlı kontrol, filtre temizliği/değişimi ve gaz dolumu yapılarak klimanız en iyi performansına kavuşturulur.',
    ],
    features: [
      'Klima sistemi basınç testi',
      'Gaz dolumu (R134a / R1234yf)',
      'Polen filtresi değişimi',
      'Kaçak tespiti ve onarımı',
      'Kompresör kontrolü',
      'Kondenser ve evaporatör temizliği',
      'Koku giderme işlemi',
      'Sistem performans testi',
    ],
    faq: [
      { q: 'Klima bakımı ne sıklıkla yapılmalı?', a: 'Yılda bir kez veya soğutma performansında düşüş fark ettiğinizde klima bakımı yaptırmanızı öneririz.' },
      { q: 'Klima gazı neden biter?', a: 'Klima sisteminde küçük sızıntılar zamanla gaz kaybına yol açar. Kaçak tespiti yapılarak sorun kalıcı olarak çözülür.' },
    ],
    cta: 'Klima Bakımı Randevusu Al',
  },

  'oto-lastik': {
    h1: 'Antalya Oto Lastik Değişim ve Balans',
    longDesc: [
      'Lastikler, aracınızın yolla tek temas noktasıdır ve sürüş güvenliğini doğrudan etkiler. Yıpranmış, dengesiz veya hatalı monte edilmiş lastikler hem güvenliği hem de yakıt tüketimini olumsuz etkiler.',
      'CLASS AUTO lastik servisinde değişim, balans ve rot ayarı işlemleri modern ekipmanlarla gerçekleştirilmektedir.',
    ],
    features: [
      'Mevsimlik lastik değişimi',
      'Lastik montajı ve sökümü',
      'Statik ve dinamik balans',
      'Rot ve balans ayarı',
      'Lastik tamir',
      'Nitrojen dolumu',
      'Lastik basıncı kontrolü',
      'Diş derinliği ölçümü',
    ],
    faq: [
      { q: 'Lastik ne zaman değiştirilmeli?', a: 'Diş derinliği 1,6 mm\'nin altına düştüğünde veya lastik 5 yılı geçtiğinde değiştirilmesi önerilir.' },
      { q: 'Balans ayarı ne kadar önemli?', a: 'Hatalı balans, titreşim, direksiyon sallanması ve hızlı lastik aşınmasına yol açar. Her lastik değişiminde balans yapılması gerekir.' },
    ],
    cta: 'Lastik Değişimi Randevusu Al',
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> };

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.id }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.id === slug);
  if (!service) return {};
  const data = SERVICE_DATA[slug];
  return generatePageMetadata({
    title: `${data?.h1 || service.title} | CLASS AUTO Antalya Oto Servis`,
    description: service.description,
    slug: `hizmetler/${slug}`,
    keywords: [...service.keywords],
  });
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.id === slug);
  if (!service) notFound();

  const data = SERVICE_DATA[slug];
  const settings = await getSiteSettings().catch(() => null);

  const hasPhone = Boolean(settings?.phone?.trim());
  const hasWhatsApp = Boolean(settings?.whatsapp?.trim());
  const waNum = settings?.whatsapp?.replace(/\D/g, '') || '';
  const waHref = hasWhatsApp
    ? `https://wa.me/${waNum}?text=${encodeURIComponent(`Merhaba, ${service!.title} hakkında bilgi almak istiyorum.`)}`
    : '/iletisim';


  // Schema: Service + BreadcrumbList
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data?.h1 || service.title,
    description: service.description,
    provider: {
      '@type': 'AutoRepair',
      name: 'CLASS AUTO',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Güzeloba Mah. Havaalanı Cad. No:11/D',
        addressLocality: 'Muratpaşa',
        addressRegion: 'Antalya',
        postalCode: '07230',
        addressCountry: 'TR',
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://www.classotoservis.com' },
      { '@type': 'ListItem', position: 2, name: 'Hizmetler', item: 'https://www.classotoservis.com/hizmetler' },
      { '@type': 'ListItem', position: 3, name: data?.h1 || service.title, item: `https://www.classotoservis.com/hizmetler/${slug}` },
    ],
  };

  const faqSchema = data?.faq && {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      {/* Schema markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: '8rem', paddingBottom: '4rem', background: '#F5F6F7' }}>
        <div className="container-site">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#66717C', listStyle: 'none', margin: 0, padding: 0 }}>
              <li><Link href="/" style={{ color: '#66717C', textDecoration: 'none' }}>Ana Sayfa</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/hizmetler" style={{ color: '#66717C', textDecoration: 'none' }}>Hizmetlerimiz</Link></li>
              <li aria-hidden="true">/</li>
              <li style={{ color: '#1D252D' }}>{service.title}</li>
            </ol>
          </nav>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(227,6,19,0.08)', border: '1px solid rgba(227,6,19,0.2)', borderRadius: '999px', padding: '4px 12px', marginBottom: '16px' }}>
            <span style={{ color: '#E30613', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hizmetimiz</span>
          </div>

          {/* H1 — unique per service */}
          <h1 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: 'clamp(1.75rem,5vw,3rem)', fontWeight: 700, color: '#1D252D', marginBottom: '16px', lineHeight: 1.1 }}>
            {data?.h1 || service.title}
          </h1>
          <p style={{ color: '#66717C', fontSize: '1.125rem', maxWidth: '640px', lineHeight: 1.7 }}>
            {service.shortDesc}
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <section className="section-py" style={{ background: '#FFFFFF' }}>
        <div className="container-site">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }}
            className="service-detail-grid">

            {/* Main content */}
            <div>
              {data?.longDesc.map((para, i) => (
                <p key={i} style={{ color: '#1D252D', lineHeight: 1.8, fontSize: '17px', marginBottom: '1.25rem' }}>{para}</p>
              ))}

              {data?.features && (
                <div style={{ marginTop: '2rem' }}>
                  <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#1D252D', marginBottom: '1.25rem' }}>
                    Kapsam ve İçerik
                  </h2>
                  <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', listStyle: 'none', margin: 0, padding: 0 }} className="features-list">
                    {data.features.map((feature) => (
                      <li key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#1D252D', fontSize: '14px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* FAQ for this service */}
              {data?.faq && data.faq.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                  <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#1D252D', marginBottom: '1.25rem' }}>
                    Sık Sorulan Sorular
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.faq.map((item) => (
                      <details key={item.q} style={{ background: '#F5F6F7', border: '1px solid #E2E6EA', borderRadius: '10px', overflow: 'hidden' }}>
                        <summary style={{ padding: '14px 18px', cursor: 'pointer', listStyle: 'none', fontWeight: 600, color: '#1D252D', fontSize: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                          {item.q}
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                        </summary>
                        <div style={{ padding: '0 18px 14px', color: '#66717C', fontSize: '14px', lineHeight: 1.7, borderTop: '1px solid #E2E6EA' }}>
                          <p style={{ paddingTop: '10px' }}>{item.a}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Related services */}
              <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#F5F6F7', border: '1px solid #E2E6EA', borderRadius: '12px' }}>
                <h3 style={{ color: '#66717C', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                  İlgili Hizmetlerimiz
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SERVICES.filter((s) => s.id !== slug).slice(0, 5).map((s) => (
                    <Link
                      key={s.id}
                      href={s.slug}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '6px', color: '#1D252D', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* CTA card */}
              <div style={{ background: '#202A34', borderRadius: '14px', padding: '1.5rem' }}>
                <h3 style={{ color: '#F5F6F7', fontFamily: 'Oswald, Arial Narrow, sans-serif', fontWeight: 700, fontSize: '1.25rem', marginBottom: '10px' }}>
                  Randevu Almak İster Misiniz?
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                  Aracınızı inceleyip size en doğru çözümü sunalım.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link href="/iletisim" className="btn-primary" style={{ justifyContent: 'center' }}>
                    {data?.cta || 'Randevu Al'}
                  </Link>

                  {hasPhone && (
                    <a
                      href={`tel:${(settings?.phone || '').replace(/\s/g, '')}`}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.7rem', background: '#E30613', color: '#fff', fontWeight: 600, borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}
                      aria-label="Hemen Ara"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      Hemen Ara
                    </a>
                  )}

                  {hasWhatsApp && (
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.7rem', background: '#25D366', color: '#fff', fontWeight: 600, borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}
                      aria-label="WhatsApp ile Yaz"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp ile Yaz
                    </a>
                  )}
                </div>
              </div>

              {/* Info card */}
              <div style={{ background: '#F5F6F7', border: '1px solid #E2E6EA', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span style={{ color: '#1D252D', fontSize: '13px', fontWeight: 600 }}>Çalışma Saatleri</span>
                </div>
                <p style={{ color: '#66717C', fontSize: '13px' }}>{settings?.workingHours || 'Pazartesi – Cumartesi: 08:00 – 18:00'}</p>
                <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>Pazar: Kapalı</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section style={{ background: '#F5F6F7', paddingBlock: '3rem', borderTop: '1px solid #E2E6EA' }}>
        <div className="container-site" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#1D252D', marginBottom: '12px' }}>
            Hizmet Almak İçin Bize Ulaşın
          </h2>
          <p style={{ color: '#66717C', marginBottom: '1.5rem' }}>
            CLASS AUTO — Antalya Muratpaşa, Güzeloba
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {hasPhone && (
              <a
                href={`tel:${(settings?.phone || '').replace(/\s/g, '')}`}
                className="btn-primary"
                aria-label="Hemen Ara"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Hemen Ara
              </a>
            )}
            {hasWhatsApp && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                aria-label="WhatsApp ile Yaz"
              >
                WhatsApp ile Yaz
              </a>
            )}
            <Link href="/iletisim" className="btn-secondary" style={{ borderColor: '#E2E6EA', color: '#1D252D' }}>
              İletişim Formu
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .service-detail-grid { grid-template-columns: 1fr 360px; }
        @media (max-width: 1023px) { .service-detail-grid { grid-template-columns: 1fr !important; } }
        .features-list { grid-template-columns: 1fr 1fr; }
        @media (max-width: 600px) { .features-list { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
