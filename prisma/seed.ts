import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// ─── Varsayılan site ayarları ─────────────────────────────────────────────────
const defaultSettings = [
  // Genel
  { key: 'site_title', value: 'CLASS AUTO', group: 'general', label: 'Site Başlığı', type: 'text' },
  { key: 'site_tagline', value: 'Antalya Muratpaşa Profesyonel Oto Servis', group: 'general', label: 'Slogan', type: 'text' },
  { key: 'site_url', value: 'https://www.classotoservis.com', group: 'general', label: 'Site URL', type: 'text' },
  { key: 'brand_name', value: 'CLASS AUTO', group: 'general', label: 'Marka Adı', type: 'text' },
  // İletişim
  { key: 'phone', value: '05523637425', group: 'contact', label: 'Telefon', type: 'text' },
  { key: 'phone_display', value: '0552 363 74 25', group: 'contact', label: 'Telefon (Görüntüleme)', type: 'text' },
  { key: 'whatsapp', value: '905523637425', group: 'contact', label: 'WhatsApp (Başında + olmadan)', type: 'text' },
  { key: 'email', value: 'classotoservis07@gmail.com', group: 'contact', label: 'E-Posta', type: 'text' },
  { key: 'address', value: 'Güzeloba Mahallesi Havaalanı Caddesi No:11/D, Muratpaşa / Antalya', group: 'contact', label: 'Adres', type: 'textarea' },
  { key: 'address_landmark', value: 'Shell Petrol yanı', group: 'contact', label: 'Adres Tarif', type: 'text' },
  { key: 'google_maps_url', value: 'https://maps.google.com/?q=CLASS+AUTO+Antalya+Güzeloba', group: 'contact', label: 'Google Maps URL', type: 'text' },
  { key: 'working_hours', value: 'Pazartesi – Cumartesi: 08:00 – 18:00', group: 'contact', label: 'Çalışma Saatleri', type: 'text' },
  { key: 'working_start', value: '08:00', group: 'contact', label: 'Açılış Saati', type: 'text' },
  { key: 'working_end', value: '18:00', group: 'contact', label: 'Kapanış Saati', type: 'text' },
  { key: 'working_days', value: '1,2,3,4,5,6', group: 'contact', label: 'Çalışma Günleri (0=Pazar)', type: 'text' },
  // Logo
  { key: 'logo_main', value: '', group: 'logo', label: 'Ana Logo (Yatay)', type: 'image' },
  { key: 'logo_dark', value: '', group: 'logo', label: 'Koyu Zemin Logosu', type: 'image' },
  { key: 'logo_light', value: '', group: 'logo', label: 'Açık Zemin Logosu', type: 'image' },
  { key: 'logo_mobile', value: '', group: 'logo', label: 'Mobil Logo', type: 'image' },
  { key: 'favicon', value: '', group: 'logo', label: 'Favicon', type: 'image' },
  { key: 'og_image', value: '', group: 'logo', label: 'Sosyal Medya Görseli (OG)', type: 'image' },
  // SEO
  { key: 'meta_title', value: 'CLASS AUTO — Antalya Muratpaşa Oto Servis', group: 'seo', label: 'Meta Başlık (Ana Sayfa)', type: 'text' },
  { key: 'meta_desc', value: "Antalya Muratpaşa Güzeloba'da profesyonel oto servis. Mekanik, kaporta-boya, klima, lastik ve arıza tespiti. CLASS AUTO güvencesiyle.", group: 'seo', label: 'Meta Açıklama', type: 'textarea' },
  { key: 'google_analytics', value: '', group: 'seo', label: 'Google Analytics ID', type: 'text' },
  { key: 'google_tag_manager', value: '', group: 'seo', label: 'GTM ID', type: 'text' },
  { key: 'google_search_console', value: '', group: 'seo', label: 'Search Console Doğrulama Kodu', type: 'text' },
  // Sosyal Medya
  { key: 'social_instagram', value: '', group: 'social', label: 'Instagram URL', type: 'text' },
  { key: 'social_facebook', value: '', group: 'social', label: 'Facebook URL', type: 'text' },
  { key: 'social_youtube', value: '', group: 'social', label: 'YouTube URL', type: 'text' },
  { key: 'social_tiktok', value: '', group: 'social', label: 'TikTok URL', type: 'text' },
];

// ─── Varsayılan hizmetler ─────────────────────────────────────────────────────
const defaultServices = [
  { slug: 'periyodik-bakim', title: 'Periyodik Bakım', shortDesc: 'Yağ, filtre ve rötinler dahil kapsamlı periyodik araç bakımı.', description: 'Aracınızın uzun ömürlü ve güvenli çalışması için düzenli periyodik bakım şarttır. Yağ değişimi, filtre yenileme, buji kontrolü ve sistematik tarama ile sorunları erkenden tespit ediyoruz.', sortOrder: 1 },
  { slug: 'mekanik-bakim', title: 'Mekanik Bakım ve Onarım', shortDesc: 'Motor, şanzıman ve mekanik sistemlerin uzman onarımı.', description: 'Her marka ve model araca kapsamlı mekanik bakım ve onarım hizmeti sunuyoruz. Deneyimli teknisyenlerimiz motor ve şanzıman dahil tüm mekanik aksamı profesyonelce tamir eder.', sortOrder: 2 },
  { slug: 'motor-bakim', title: 'Motor Bakım ve Onarımı', shortDesc: 'Motor revizyonu, segment değişimi ve kapsamlı motor onarımı.', description: 'Motor verimliliği düşüyor veya çeşitli arızalar yaşanıyorsa uzman ekibimiz kapsamlı motor tanılama ve onarım hizmeti sunar.', sortOrder: 3 },
  { slug: 'sanziman', title: 'Şanzıman Kontrol ve Onarımı', shortDesc: 'Manuel ve otomatik şanzıman bakım ve onarımı.', description: 'Şanzıman vites değiştirmiyorsa veya anormal ses çıkarıyorsa profesyonel şanzıman tanılama ve onarım hizmetinden yararlanın.', sortOrder: 4 },
  { slug: 'fren-sistemi', title: 'Fren Sistemi', shortDesc: 'Fren balatası, disk, kampana ve fren sıvısı değişimi.', description: 'Güvenli sürüş için fren sistemi kritik önem taşır. Balatadan diske, kampanadan ABS sensörüne kadar tüm fren sistemi kontrolü ve onarımı yapıyoruz.', sortOrder: 5 },
  { slug: 'suspansiyon', title: 'Süspansiyon ve Ön Takım', shortDesc: 'Amortisör, rotil, rot başı ve geometri ayarı.', description: 'Süspansiyon ve ön takım arızaları sürüş konforunu ve güvenliğini etkiler. Amortisör değişiminden rot ayarına kadar kapsamlı hizmet sunuyoruz.', sortOrder: 6 },
  { slug: 'oto-elektrik', title: 'Oto Elektrik ve Elektronik', shortDesc: 'Araç elektrik arızaları, sensörler ve elektronik onarım.', description: 'Modern araçlardaki karmaşık elektronik sistemlerin tanılanması ve onarımı için profesyonel ekipman ve uzman bilgisi gerekmektedir.', sortOrder: 7 },
  { slug: 'aku-kontrol', title: 'Akü Kontrolü ve Değişimi', shortDesc: 'Akü test, şarj ve değişim hizmeti.', description: 'Aracınız çalışmıyor veya akü uyarı ışığı yanıyorsa profesyonel akü testi ve değişim hizmetinden yararlanabilirsiniz.', sortOrder: 8 },
  { slug: 'ariza-tespit', title: 'Bilgisayarlı Arıza Tespiti', shortDesc: 'OBD-II ile kapsamlı elektronik sistem taraması.', description: 'Güncel OBD-II cihazları ve kapsamlı tanılama yazılımları kullanılarak hata kodları okunur, yorumlanır ve kalıcı çözüm üretilir.', sortOrder: 9 },
  { slug: 'klima-bakimi', title: 'Klima Bakımı ve Klima Gazı', shortDesc: 'Klima filtresi, gaz dolumu ve sistem kontrolü.', description: 'Araç kliması yaz aylarında konforun vazgeçilmez bir parçasıdır. Kapsamlı klima kontrolü ve gaz dolumu hizmetiyle performansınızı geri kazanın.', sortOrder: 10 },
  { slug: 'kaporta', title: 'Kaporta Onarımı', shortDesc: 'Kaza ve darbe hasarlarının profesyonel kaporta onarımı.', description: 'Kaza sonrası kaporta hasarlarını, çarpma izlerini ve eğrilikleri fabrika kalitesinde onarıyoruz.', sortOrder: 11 },
  { slug: 'boya', title: 'Profesyonel Oto Boya', shortDesc: 'Orijinal renk eşleştirmeli tam ve parsiyel oto boya.', description: 'Renk eşleştirme teknolojimizle orijinal renge en yakın sonucu elde ediyoruz. Tam veya parçalı boya hizmetleri sunuyoruz.', sortOrder: 12 },
  { slug: 'boyasiz-gocuk', title: 'Boyasız Göçük Düzeltme', shortDesc: 'Boya dokunmadan PDR tekniğiyle göçük onarımı.', description: 'PDR (Paintless Dent Repair) yöntemiyle aracınızın boyasına dokunmadan göçükleri düzeltiyoruz. Hızlı ve ekonomik çözüm.', sortOrder: 13 },
  { slug: 'lastik', title: 'Oto Lastik Değişimi', shortDesc: 'Mevsimlik lastik değişimi ve montaj hizmeti.', description: 'Mevsimlik lastik değişimi, montaj ve söküm işlemlerini modern ekipmanlarla gerçekleştiriyoruz.', sortOrder: 14 },
  { slug: 'balans', title: 'Balans ve Lastik Kontrolü', shortDesc: 'Dinamik balans, rot ayarı ve lastik kontrolü.', description: 'Balans bozukluğu ve rot ayarı arızaları yakıt tüketimini artırır ve lastikleri hızla aşındırır. Modern cihazlarla hassas ayar yapıyoruz.', sortOrder: 15 },
  { slug: 'genel-kontrol', title: 'Genel Araç Kontrolü', shortDesc: 'Kapsamlı 360° araç sağlık taraması.', description: 'Aracınızın genel durumunu tespit etmek için kapsamlı kontrol hizmeti sunuyoruz. Olası sorunları erken yakalayın.', sortOrder: 16 },
];

// ─── Varsayılan SSS ───────────────────────────────────────────────────────────
const defaultFAQs = [
  { question: 'Randevu almak zorunlu mu?', answer: 'Zorunlu değil, ancak beklememek için önceden randevu almanızı öneririz. WhatsApp veya telefon ile kolayca randevu alabilirsiniz.', sortOrder: 1 },
  { question: 'Hangi araç markaları için hizmet veriyorsunuz?', answer: 'Tüm marka ve model araçlara hizmet veriyoruz. Yabancı ve yerli marka fark etmeksizin uzman ekibimiz aracınıza bakabilir.', sortOrder: 2 },
  { question: 'Yetkili servis fiyatlarıyla fark var mı?', answer: 'Genellikle daha uygun fiyatlarla daha hızlı hizmet sunuyoruz. Fiyatlandırmamız şeffaftır; işlem öncesi tahmini maliyet paylaşılır.', sortOrder: 3 },
  { question: 'Parça garantisi var mı?', answer: 'Kullandığımız parça ve işçilik için garanti uyguluyoruz. Detayları servisimizde öğrenebilirsiniz.', sortOrder: 4 },
  { question: 'İşlem süresi ne kadar?', answer: 'İşlem türüne göre değişir. Basit bakımlar birkaç saat sürerken kapsamlı onarımlar 1-3 gün alabilir. Aracı teslim alırken tahmini süreyi bildiririz.', sortOrder: 5 },
  { question: 'Kaporta ve boya işlemleri yapıyor musunuz?', answer: 'Evet, kaporta onarımı, profesyonel boya ve boyasız göçük düzeltme hizmetleri sunuyoruz.', sortOrder: 6 },
];

// ─── Hero section varsayılanları ──────────────────────────────────────────────
const defaultHero = {
  title: 'Aracınız İçin Güvenilir ve Profesyonel Servis',
  subtitle: 'Mekanikten kaporta ve boyaya, arıza tespitinden lastik hizmetlerine kadar aracınızın tüm ihtiyaçları CLASS AUTO güvencesiyle tek noktada.',
  btn1Text: "WhatsApp'tan Randevu Al",
  btn1Url: 'https://wa.me/905523637425',
  btn2Text: 'Hemen Ara',
  btn2Url: 'tel:+905523637425',
  btn3Text: 'Hizmetleri İncele',
  btn3Url: '/hizmetler',
  trustBadges: JSON.stringify(['Uzman Ekip', 'Şeffaf Bilgilendirme', 'Tüm Markalara Hizmet', 'Kaliteli İşçilik']),
  overlayOpacity: 60,
  height: '90vh',
  textAlign: 'left',
  isActive: true,
};

export async function seed() {
  console.log('🌱 Veritabanı başlatılıyor...');

  // Site ayarları
  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✓ Site ayarları oluşturuldu');

  // Hizmetler
  for (const service of defaultServices) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log('✓ Hizmetler oluşturuldu');

  // SSS
  for (const faq of defaultFAQs) {
    const existing = await prisma.fAQ.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.fAQ.create({ data: faq });
    }
  }
  console.log('✓ SSS oluşturuldu');

  // Hero
  const existingHero = await prisma.heroSection.findFirst();
  if (!existingHero) {
    await prisma.heroSection.create({ data: defaultHero });
    console.log('✓ Hero bölümü oluşturuldu');
  }

  console.log('✅ Seed tamamlandı!');
}
