const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://class-auto-db-classotoservis07-dotcom.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODgxNjYzNzEsImlkIjoiMDFhMDU3MDItZDEwMS03MWQwLWI1NjItZDQxNGE0ZThmNGMxIiwia2lkIjoiVjhvdzc3alpFaU5Vd3NSLUpOcmNpc3QwTWoxRmptUURuS2Etamc4SUU3VSIsInJpZCI6ImRkYmE1ZjRmLWZjZjQtNDUyMy05MTFmLTEyNmE1ZTdkMDgyMiJ9.au6ttFP04mp6bYA8RcbHHJexg-h_JfDIEtQTEcSxb6NcU1n8gQOf8uyBtRwD5N6_fDRWWQ9ND4ZTy6HMErRYAA'
});

// key, value, group, label, type
const settings = [
  ['phone',              '05523637425',                                        'contact',  'Telefon',              'text'],
  ['phoneDisplay',       '0552 363 74 25',                                     'contact',  'Telefon (Gösterim)',    'text'],
  ['whatsapp',           '905523637425',                                       'contact',  'WhatsApp Numarası',     'text'],
  ['whatsappMessage',    'Merhaba, randevu almak istiyorum.',                  'contact',  'WhatsApp Mesajı',       'text'],
  ['email',              'classotoservis07@gmail.com',                         'contact',  'E-posta',               'text'],
  ['address',            'Güzeloba Mah. Havaalanı Cad. No:11/D, Muratpaşa',   'contact',  'Adres',                 'text'],
  ['addressLandmark',    'Shell Petrol yanı',                                  'contact',  'Adres Tarifi',          'text'],
  ['workingHours',       'Pazartesi - Cumartesi: 08:00 - 18:00',               'contact',  'Çalışma Saatleri',      'text'],
  ['siteTitle',          'CLASS AUTO - Antalya Oto Servis',                    'general',  'Site Başlığı',          'text'],
  ['brandName',          'CLASS AUTO',                                         'general',  'Marka Adı',             'text'],
  ['tagline',            'Güvenilir ve Profesyonel Oto Servis',                'general',  'Slogan',                'text'],
  ['metaTitle',          'CLASS AUTO - Antalya Muratpasa Oto Servis',          'seo',      'Meta Başlık',           'text'],
  ['metaDesc',           'Antalya Muratpasa Güzelobada profesyonel oto servis. Kaporta, boya, mekanik, elektrik, lastik ve klima hizmetleri.', 'seo', 'Meta Açıklama', 'textarea'],
  ['canonicalBase',      'https://www.classotoservis.com',                     'seo',      'Canonical URL',         'text'],
  ['mapEmbedUrl',        '',                                                   'map',      'Harita Embed URL',      'text'],
  ['mapDirectionsUrl',   'https://maps.google.com/?q=CLASS+AUTO+Antalya',      'map',      'Yol Tarifi URL',        'text'],
  ['mapTitle',           'CLASS AUTO Oto Servis',                              'map',      'Harita Başlığı',        'text'],
  ['mapActive',          'true',                                               'map',      'Harita Aktif',          'boolean'],
  ['logoMain',           '',                                                   'logo',     'Ana Logo',              'image'],
  ['logoDark',           '',                                                   'logo',     'Koyu Logo',             'image'],
  ['logoMobile',         '',                                                   'logo',     'Mobil Logo',            'image'],
  ['logoFooter',         '',                                                   'logo',     'Footer Logo',           'image'],
  ['logoLight',          '',                                                   'logo',     'Açık Logo',             'image'],
  ['favicon',            '',                                                   'logo',     'Favicon',               'image'],
  ['ogImage',            '',                                                   'logo',     'OG Görseli',            'image'],
  ['instagram',          '',                                                   'social',   'Instagram',             'text'],
  ['facebook',           '',                                                   'social',   'Facebook',              'text'],
  ['youtube',            '',                                                   'social',   'YouTube',               'text'],
  ['twitter',            '',                                                   'social',   'Twitter/X',             'text'],
  ['gtmId',              '',                                                   'analytics','GTM ID',                'text'],
  ['ga4Id',              '',                                                   'analytics','GA4 ID',                'text'],
  ['googleAdsId',        '',                                                   'analytics','Google Ads ID',         'text'],
  ['googleAdsConversionId','',                                                 'analytics','Conversion ID',         'text'],
  ['googleVerification', '',                                                   'seo',      'Google Doğrulama',      'text'],
];

async function run() {
  console.log('Turso SiteSetting seed baslıyor... (' + settings.length + ' kayıt)');
  let ok = 0, err = 0;

  for (const [key, value, group, label, type] of settings) {
    try {
      const existing = await client.execute({ sql: 'SELECT id FROM "SiteSetting" WHERE "key" = ?', args: [key] });
      if (existing.rows.length > 0) {
        await client.execute({ sql: 'UPDATE "SiteSetting" SET "value" = ?, "updatedAt" = CURRENT_TIMESTAMP WHERE "key" = ?', args: [value, key] });
      } else {
        await client.execute({
          sql: 'INSERT INTO "SiteSetting" ("key","value","group","label","type","updatedAt") VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)',
          args: [key, value, group, label, type]
        });
      }
      ok++;
      if (key === 'phone' || key === 'whatsapp' || key === 'logoMain') console.log('OK:', key, '=', value || '(bos)');
    } catch (e) {
      console.log('ERR ' + key + ':', e.message ? e.message.substring(0, 80) : e);
      err++;
    }
  }

  // HeroSlide ekle
  try {
    const existing = await client.execute('SELECT id FROM "HeroSlide" LIMIT 1');
    if (existing.rows.length === 0) {
      await client.execute({
        sql: 'INSERT INTO "HeroSlide" ("sortOrder","isActive","title","subtitle","btn1Text","btn1Url","btn2Text","btn2Url","overlayOpacity","updatedAt") VALUES (0,1,?,?,?,?,?,?,55,CURRENT_TIMESTAMP)',
        args: ['Antalya\'nin Güvenilir Oto Servisi', 'Kaporta, Boya, Mekanik ve daha fazlasi', 'WhatsApp Randevu Al', '/iletisim', 'Hizmetlerimiz', '/hizmetler']
      });
      console.log('OK: HeroSlide varsayilan eklendi');
      ok++;
    } else {
      console.log('SKIP: HeroSlide zaten var');
    }
  } catch (e) {
    console.log('ERR HeroSlide:', e.message ? e.message.substring(0,80) : e);
    err++;
  }

  await client.close();
  console.log('\nTAMAMLANDI: ' + ok + ' OK, ' + err + ' hata');
}

run().catch(console.error);
