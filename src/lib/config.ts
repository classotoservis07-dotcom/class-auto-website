/**
 * CLASS AUTO — Merkezi Marka ve İletişim Ayarları
 *
 * ⚠️  ONAY_BEKLIYOR: Telefon ve WhatsApp numaraları henüz onaylanmadı.
 * Panelden girilene kadar hiçbir numara sitede gösterilmez.
 *
 * Güncellemek için: Yönetim Paneli → Site Ayarları → İletişim sekmesi
 */

export const SITE_CONFIG = {
  // ─── Marka ──────────────────────────────────────────────────────────────
  brand: {
    name: 'CLASS AUTO',
    tagline: 'Güvenilir ve Profesyonel Oto Servis',
    description:
      'Mekanikten kaporta ve boyaya, arıza tespitinden lastik hizmetlerine kadar aracınızın tüm ihtiyaçları CLASS AUTO güvencesiyle tek noktada.',
    sector: 'Oto Servis',
    /** Logo yolu — şeffaf PNG veya SVG olarak public/logo/ altına yerleştirin */
    logoPath: '/logo/class-auto-logo.png',
    logoAlt: 'CLASS AUTO Oto Servis Logosu',
    faviconPath: '/favicon.ico',
  },

  // ─── İletişim ─────────────────────────────────────────────────────────────
  contact: {
    /**
     * ⚠️  ONAY_BEKLIYOR — Telefon numarası yönetim panelinden girilecek.
     * Boş string bırakıldığında sitede telefon butonu gizlenir.
     */
    phone: '' as string,
    phoneDisplay: '' as string,
    phonePrimary: '' as string,

    /** ⚠️  ONAY_BEKLIYOR — E-posta yönetim panelinden girilecek. */
    email: '' as string,
    emailDisplay: '' as string,

    get formRecipient() {
      return process.env.CONTACT_FORM_RECIPIENT ?? '';
    },

    /**
     * ⚠️  ONAY_BEKLIYOR — WhatsApp numarası yönetim panelinden girilecek.
     * Boş string bırakıldığında WhatsApp butonu gizlenir.
     */
    whatsapp: '' as string,
    whatsappMessage:
      'Merhaba, CLASS AUTO oto servisiyle iletişime geçmek istiyorum.',
  },

  // ─── Adres ─────────────────────────────────────────────────────────────
  address: {
    full: 'Güzeloba Mahallesi Havaalanı Caddesi No:11/D, Muratpaşa / Antalya',
    landmark: 'Shell Petrol yanı',
    district: 'Muratpaşa',
    city: 'Antalya',
    country: 'Türkiye',
    postalCode: '07230',
    googleMapsUrl:
      'https://www.google.com/maps/search/CLASS+AUTO+Oto+Servis+Güzeloba+Havaalanı+Caddesi+Antalya',
    googleMapsEmbed: '',
    googleBusinessUrl: 'https://www.classotoservis.com',
  },

  // ─── Çalışma Saatleri ───────────────────────────────────────────────────
  workingHours: {
    weekdays: 'Pazartesi – Cumartesi: 08:00 – 18:00',
    saturday: '08:00 – 18:00',
    sunday: 'Kapalı',
    note: 'Randevu için lütfen önceden iletişime geçiniz.',
    schedule: [
      { day: 'Pazartesi', hours: '08:00 – 18:00', open: true },
      { day: 'Salı',      hours: '08:00 – 18:00', open: true },
      { day: 'Çarşamba',  hours: '08:00 – 18:00', open: true },
      { day: 'Perşembe',  hours: '08:00 – 18:00', open: true },
      { day: 'Cuma',      hours: '08:00 – 18:00', open: true },
      { day: 'Cumartesi', hours: '08:00 – 18:00', open: true },
      { day: 'Pazar',     hours: 'Kapalı',         open: false },
    ],
  },

  // ─── Sosyal Medya ───────────────────────────────────────────────────────
  social: {
    /** ⚠️  ONAY_BEKLIYOR — Sosyal medya hesapları yönetim panelinden girilecek */
    instagram: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    twitter: '',
  },

  // ─── SEO ────────────────────────────────────────────────────────────────
  seo: {
    siteUrl: 'https://www.classotoservis.com',
    defaultTitle: 'CLASS AUTO — Antalya Oto Servis | Muratpaşa Güzeloba',
    titleTemplate: '%s | CLASS AUTO Antalya Oto Servis',
    defaultDescription:
      "Antalya Muratpaşa Güzeloba'da profesyonel oto servis. Mekanik, kaporta-boya, oto elektrik, klima bakımı, lastik değişimi ve bilgisayarlı arıza tespiti.",
    keywords: [
      'Antalya oto servis',
      'Muratpaşa oto servis',
      'Lara oto servis',
      'Antalya oto tamir',
      'Antalya mekanik servis',
      'Antalya kaporta boya',
      'Antalya arıza tespit',
      'Güzeloba oto servis',
      'Antalya oto lastik',
      'CLASS AUTO',
    ],
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image' as const,
    locale: 'tr_TR',
  },

  // ─── Takip Kodları ──────────────────────────────────────────────────────
  tracking: {
    get googleAnalyticsId() { return process.env.NEXT_PUBLIC_GA_ID ?? ''; },
    get googleTagManagerId() { return process.env.NEXT_PUBLIC_GTM_ID ?? ''; },
    get metaPixelId() { return process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ''; },
    get searchConsoleVerification() {
      return process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? '';
    },
  },
} satisfies Record<string, unknown>;

// ─── Hizmetler ────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    id: 'periyodik-bakim',
    title: 'Periyodik Bakım',
    slug: '/hizmetler/periyodik-bakim',
    shortDesc:
      'Üretici önerilerine uygun düzenli bakım ile aracınızı en iyi performansta tutun.',
    description:
      'Motor yağı değişiminden filtre kontrolüne, fren sisteminden aydınlatmaya kadar kapsamlı periyodik bakım hizmeti. Her marka ve model araca uygun bakım programı.',
    icon: 'Wrench',
    keywords: ['periyodik bakım Antalya', 'yağ değişimi Antalya', 'araç bakım'],
  },
  {
    id: 'mekanik-bakim',
    title: 'Mekanik Bakım ve Onarım',
    slug: '/hizmetler/mekanik-bakim',
    shortDesc:
      'Motor, şanzıman, fren sistemi ve tüm mekanik aksamlarınızda uzman servis.',
    description:
      'Aracınızın motor, şanzıman, fren, süspansiyon ve diğer mekanik sistemlerinde kapsamlı bakım ve onarım hizmetleri sunuyoruz.',
    icon: 'Wrench',
    keywords: ['mekanik servis Antalya', 'motor tamiri', 'şanzıman tamiri'],
  },
  {
    id: 'oto-elektrik',
    title: 'Oto Elektrik ve Elektronik',
    slug: '/hizmetler/oto-elektrik',
    shortDesc:
      'Araç elektrik sistemleri, sensörler ve elektronik aksamlarda uzman müdahale.',
    description:
      'Akü, alternatör, marş motoru, aydınlatma sistemleri, sensörler ve araç içi elektroniklerin tanı ve onarımında modern ekipmanlarla hizmet veriyoruz.',
    icon: 'Zap',
    keywords: ['oto elektrik Antalya', 'araç elektronik', 'akü değişimi'],
  },
  {
    id: 'kaporta-boya',
    title: 'Kaporta ve Profesyonel Boya',
    slug: '/hizmetler/kaporta-boya',
    shortDesc:
      'Hasar görmüş kaportaların onarımı ve fabrika kalitesinde boya uygulaması.',
    description:
      'Kaza hasarı, çarpma ve korozyon kaynaklı kaporta onarımlarında profesyonel yaklaşım. Fabrika renk eşleştirmesiyle yüksek kalite boya uygulaması.',
    icon: 'PaintBucket',
    keywords: ['kaporta tamiri Antalya', 'oto boya Antalya', 'kaza hasarı'],
  },
  {
    id: 'boyasiz-gocuk-duzeltme',
    title: 'Boyasız Göçük Düzeltme',
    slug: '/hizmetler/boyasiz-gocuk-duzeltme',
    shortDesc:
      'Boya bütünlüğünü koruyarak küçük ve orta göçüklerin giderilmesi.',
    description:
      'PDR yöntemiyle aracınızın boyasına dokunmadan göçük düzeltme işlemi gerçekleştiriyoruz. Kısa sürede estetik görünüm.',
    icon: 'CircleDot',
    keywords: ['boyasız göçük Antalya', 'PDR', 'göçük düzeltme'],
  },
  {
    id: 'klima-bakimi',
    title: 'Klima Bakımı ve Gaz Dolumu',
    slug: '/hizmetler/klima-bakimi',
    shortDesc:
      'Araç klimasının soğutma performansı kontrolü, filtre ve gaz dolumu.',
    description:
      'Araç klimanızın soğutma gücünü yitirmemesi için düzenli bakım ve gaz dolumu şarttır. Sızdırmazlık testi, filtre temizliği ve sistem kontrolü yapıyoruz.',
    icon: 'Wind',
    keywords: ['klima bakımı Antalya', 'araç klima', 'klima gazı dolumu'],
  },
  {
    id: 'oto-lastik',
    title: 'Oto Lastik ve Balans',
    slug: '/hizmetler/oto-lastik',
    shortDesc:
      'Lastik değişimi, balans ayarı, rot geometrisi ve basınç kontrolü.',
    description:
      'Araç güvenliğinin temelini oluşturan lastik seçimi, değişimi, balans ve rot ayarı işlemlerini profesyonel ekipmanlarla gerçekleştiriyoruz.',
    icon: 'Circle',
    keywords: ['oto lastik Antalya', 'lastik değişimi', 'balans ayarı'],
  },
  {
    id: 'ariza-tespit',
    title: 'Bilgisayarlı Arıza Tespiti',
    slug: '/hizmetler/ariza-tespit',
    shortDesc:
      'Modern OBD cihazlarıyla hızlı, doğru ve kapsamlı arıza tanılama.',
    description:
      'Aracınızın elektronik kontrol sistemlerinde oluşan arızaların tespitinde güncel OBD-II ve kapsamlı teşhis cihazları kullanıyoruz.',
    icon: 'Search',
    keywords: ['arıza tespit Antalya', 'OBD tarama', 'araç diagnostik'],
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: 'Arıza tespiti ne kadar sürer?',
    a: 'Bilgisayarlı arıza taraması genellikle 15–30 dakika içinde tamamlanır. Tespit edilen sorun doğrultusunda ek kontroller gerekebilir.',
  },
  {
    q: 'Randevu almadan gelebilir miyim?',
    a: 'Randevusuz da hizmet vermeye çalışıyoruz; ancak beklemeden servis alabilmek için önceden randevu almanızı öneririz.',
  },
  {
    q: 'Hangi marka araçlara hizmet veriyorsunuz?',
    a: 'Renault, Fiat, Volkswagen, Peugeot, Ford, Opel, Toyota, Hyundai, BMW, Mercedes-Benz ve daha pek çok marka ve modele servis sağlıyoruz.',
  },
  {
    q: 'İşlem öncesinde fiyat bilgisi veriliyor mu?',
    a: 'Evet. Aracınız incelendikten sonra herhangi bir işlem başlamadan önce tahmini maliyet ve süre hakkında sizi bilgilendiriyoruz. Onayınız olmadan işlem yapmıyoruz.',
  },
  {
    q: 'Kaporta ve boya işlemleri ne kadar sürer?',
    a: 'Hasarın büyüklüğüne göre değişmekle birlikte küçük onarımlar genellikle 1–2 gün, kapsamlı kaporta-boya işlemleri ise 3–5 gün içinde tamamlanır.',
  },
  {
    q: 'Periyodik bakımda hangi kontroller yapılır?',
    a: 'Motor yağı, filtreler (yağ, hava, yakıt, Polen), fren sistemi, akü, aydınlatma, lastik basıncı, soğutma sıvısı ve genel araç güvenlik kontrolleri yapılmaktadır.',
  },
  {
    q: 'Ödeme seçenekleri nelerdir?',
    a: 'Nakit ve kredi/banka kartı ile ödeme kabul ediyoruz. Taksit seçenekleri için lütfen bizimle iletişime geçin.',
  },
] as const;

export const BRANDS = [
  'Renault', 'Fiat', 'Volkswagen', 'Peugeot', 'Citroën',
  'Ford', 'Opel', 'Toyota', 'Hyundai', 'BMW', 'Mercedes-Benz',
  'Dacia', 'Skoda', 'Seat', 'Kia', 'Honda', 'Nissan', 'Mazda',
] as const;

export type ServiceId = (typeof SERVICES)[number]['id'];
