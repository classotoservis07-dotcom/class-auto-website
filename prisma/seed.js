const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const settings = [
  { key: 'site_title', value: 'CLASS AUTO', group: 'general', label: 'Site Başlığı', type: 'text' },
  { key: 'brand_name', value: 'CLASS AUTO', group: 'general', label: 'Marka Adı', type: 'text' },
  { key: 'site_tagline', value: 'Antalya Muratpaşa Profesyonel Oto Servis', group: 'general', label: 'Slogan', type: 'text' },
  { key: 'phone', value: '05523637425', group: 'contact', label: 'Telefon', type: 'text' },
  { key: 'phone_display', value: '0552 363 74 25', group: 'contact', label: 'Görüntüleme Telefonu', type: 'text' },
  { key: 'whatsapp', value: '905523637425', group: 'contact', label: 'WhatsApp', type: 'text' },
  { key: 'email', value: 'classotoservis07@gmail.com', group: 'contact', label: 'E-posta', type: 'text' },
  { key: 'address', value: 'Güzeloba Mah. Havaalanı Cad. No:11/D, Muratpaşa / Antalya', group: 'contact', label: 'Adres', type: 'textarea' },
  { key: 'address_landmark', value: 'Shell Petrol yanı', group: 'contact', label: 'Adres Tarif', type: 'text' },
  { key: 'working_hours', value: 'Pazartesi – Cumartesi: 08:00 – 18:00', group: 'contact', label: 'Çalışma Saatleri', type: 'text' },
  { key: 'logo_main', value: '', group: 'logo', label: 'Ana Logo', type: 'image' },
  { key: 'logo_dark', value: '', group: 'logo', label: 'Koyu Zemin Logo', type: 'image' },
  { key: 'logo_mobile', value: '', group: 'logo', label: 'Mobil Logo', type: 'image' },
  { key: 'favicon', value: '', group: 'logo', label: 'Favicon', type: 'image' },
  { key: 'og_image', value: '', group: 'logo', label: 'OG Görseli', type: 'image' },
  { key: 'meta_title', value: 'CLASS AUTO — Antalya Muratpaşa Oto Servis', group: 'seo', label: 'Meta Başlık', type: 'text' },
  { key: 'meta_desc', value: "Antalya Muratpaşa Güzeloba'da profesyonel oto servis. CLASS AUTO güvencesiyle.", group: 'seo', label: 'Meta Açıklama', type: 'textarea' },
  { key: 'google_analytics', value: '', group: 'seo', label: 'Google Analytics ID', type: 'text' },
  { key: 'social_instagram', value: '', group: 'social', label: 'Instagram URL', type: 'text' },
  { key: 'social_facebook', value: '', group: 'social', label: 'Facebook URL', type: 'text' },
];

const services = [
  { slug: 'periyodik-bakim', title: 'Periyodik Bakım', shortDesc: 'Kapsamlı periyodik araç bakımı.', description: 'Aracınızın uzun ömürlü çalışması için düzenli periyodik bakım.', sortOrder: 1 },
  { slug: 'mekanik-bakim', title: 'Mekanik Bakım ve Onarım', shortDesc: 'Motor ve mekanik sistemler.', description: 'Her marka araca kapsamlı mekanik bakım ve onarım.', sortOrder: 2 },
  { slug: 'motor-bakim', title: 'Motor Bakımı', shortDesc: 'Motor revizyonu ve onarımı.', description: 'Motor bakım ve onarımı.', sortOrder: 3 },
  { slug: 'sanziman', title: 'Şanzıman', shortDesc: 'Manuel ve otomatik şanzıman.', description: 'Şanzıman bakım ve onarımı.', sortOrder: 4 },
  { slug: 'fren-sistemi', title: 'Fren Sistemi', shortDesc: 'Balata, disk ve kampana.', description: 'Kapsamlı fren sistemi bakımı.', sortOrder: 5 },
  { slug: 'suspansiyon', title: 'Süspansiyon', shortDesc: 'Amortisör ve ön takım.', description: 'Süspansiyon ve ön takım onarımı.', sortOrder: 6 },
  { slug: 'oto-elektrik', title: 'Oto Elektrik', shortDesc: 'Araç elektrik ve elektronik.', description: 'Araç elektronik sistemleri onarımı.', sortOrder: 7 },
  { slug: 'aku-kontrol', title: 'Akü Kontrolü', shortDesc: 'Akü test ve değişimi.', description: 'Profesyonel akü testi ve değişimi.', sortOrder: 8 },
  { slug: 'ariza-tespit', title: 'Arıza Tespiti', shortDesc: 'OBD-II bilgisayarlı tarama.', description: 'Kapsamlı elektronik arıza tespiti.', sortOrder: 9 },
  { slug: 'klima-bakimi', title: 'Klima Bakımı', shortDesc: 'Klima ve gaz dolumu.', description: 'Kapsamlı klima kontrolü ve gaz dolumu.', sortOrder: 10 },
  { slug: 'kaporta', title: 'Kaporta Onarımı', shortDesc: 'Kaza hasarı onarımı.', description: 'Fabrika kalitesinde kaporta onarımı.', sortOrder: 11 },
  { slug: 'boya', title: 'Profesyonel Oto Boya', shortDesc: 'Renk eşleştirme.', description: 'Renk eşleştirme teknolojisiyle boya.', sortOrder: 12 },
  { slug: 'boyasiz-gocuk', title: 'Boyasız Göçük', shortDesc: 'PDR tekniği.', description: 'Boyaya dokunmadan göçük düzeltme.', sortOrder: 13 },
  { slug: 'lastik', title: 'Oto Lastik', shortDesc: 'Mevsimlik lastik değişimi.', description: 'Lastik değişimi ve montaj.', sortOrder: 14 },
  { slug: 'balans', title: 'Balans ve Rot', shortDesc: 'Balans ve rot ayarı.', description: 'Hassas balans ve rot ayarı.', sortOrder: 15 },
  { slug: 'genel-kontrol', title: 'Genel Araç Kontrolü', shortDesc: '360° araç taraması.', description: 'Kapsamlı genel araç kontrolü.', sortOrder: 16 },
];

const faqs = [
  { question: 'Randevu almak zorunlu mu?', answer: 'Zorunlu değil, ancak beklememek için önceden randevu almanızı öneririz. WhatsApp veya telefon ile kolayca randevu alabilirsiniz.', sortOrder: 1 },
  { question: 'Hangi araç markaları için hizmet veriyorsunuz?', answer: 'Tüm marka ve model araçlara hizmet veriyoruz. Yabancı ve yerli marka fark etmeksizin uzman ekibimiz aracınıza bakabilir.', sortOrder: 2 },
  { question: 'Yetkili servis fiyatlarıyla fark var mı?', answer: 'Genellikle daha uygun fiyatlarla daha hızlı hizmet sunuyoruz. Fiyatlandırmamız şeffaftır; işlem öncesi tahmini maliyet paylaşılır.', sortOrder: 3 },
  { question: 'Parça garantisi var mı?', answer: 'Kullandığımız parça ve işçilik için garanti uyguluyoruz. Detayları servisimizde öğrenebilirsiniz.', sortOrder: 4 },
  { question: 'İşlem süresi ne kadar?', answer: 'İşlem türüne göre değişir. Basit bakımlar birkaç saat, kapsamlı onarımlar 1-3 gün alabilir.', sortOrder: 5 },
  { question: 'Kaporta ve boya işlemleri yapıyor musunuz?', answer: 'Evet, kaporta onarımı, profesyonel boya ve boyasız göçük düzeltme hizmetleri sunuyoruz.', sortOrder: 6 },
];

async function main() {
  console.log('Seed başlıyor...');

  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log('✓ Site ayarları oluşturuldu');

  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: s });
  }
  console.log('✓ 16 hizmet oluşturuldu');

  for (const f of faqs) {
    const ex = await prisma.fAQ.findFirst({ where: { question: f.question } });
    if (!ex) await prisma.fAQ.create({ data: f });
  }
  console.log('✓ SSS oluşturuldu');

  const heroExists = await prisma.heroSection.findFirst();
  if (!heroExists) {
    await prisma.heroSection.create({
      data: {
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
        updatedAt: new Date(),
      },
    });
    console.log('✓ Hero bölümü oluşturuldu');
  }

  await prisma.$disconnect();
  console.log('✅ SEED TAMAMLANDI!');
}

main().catch((e) => {
  console.error('Seed hatası:', e);
  process.exit(1);
});
