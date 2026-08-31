/**
 * CLASS AUTO — Server-side Site Settings Fetcher
 *
 * Tüm site ayarlarını veritabanından çeker.
 * Next.js fetch caching kullanır — revalidateTag('site-settings') ile temizlenir.
 */

import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export interface SiteSettings {
  // Logo
  logoMain: string;
  logoDark: string;
  logoMobile: string;
  logoFooter: string;
  logoLight: string;
  favicon: string;
  ogImage: string;

  // Marka
  siteTitle: string;
  brandName: string;
  tagline: string;

  // İletişim
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: string;
  addressLandmark: string;
  workingHours: string;
  whatsappMessage: string;

  // Sosyal
  instagram: string;
  facebook: string;
  youtube: string;
  twitter: string;

  // SEO
  metaTitle: string;
  metaDesc: string;
  googleAnalytics: string;
  googleVerification: string;
  canonicalBase: string;

  // Harita
  mapEmbedUrl: string;
  mapDirectionsUrl: string;
  mapTitle: string;
  mapActive: boolean;

  // Analytics / Ads
  gtmId: string;
  ga4Id: string;
  googleAdsId: string;
  googleAdsConversionId: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  logoMain: '',
  logoDark: '',
  logoMobile: '',
  logoFooter: '',
  logoLight: '',
  favicon: '',
  ogImage: '',
  siteTitle: 'CLASS AUTO',
  brandName: 'CLASS AUTO',
  tagline: 'Güvenilir ve Profesyonel Oto Servis',
  phone: '',
  phoneDisplay: '',
  whatsapp: '',
  email: 'classotoservis07@gmail.com',
  address: 'Güzeloba Mah. Havaalanı Cad. No:11/D, Muratpaşa / Antalya',
  addressLandmark: 'Shell Petrol yanı',
  workingHours: 'Pazartesi – Cumartesi: 08:00 – 18:00',
  whatsappMessage: 'Merhaba, randevu almak istiyorum.',
  instagram: '',
  facebook: '',
  youtube: '',
  twitter: '',
  metaTitle: 'CLASS AUTO — Antalya Oto Servis | Muratpaşa Güzeloba',
  metaDesc: "Antalya Muratpaşa Güzeloba'da profesyonel oto servis. CLASS AUTO güvencesiyle.",
  googleAnalytics: '',
  googleVerification: '',
  canonicalBase: 'https://www.classotoservis.com',
  // Harita
  mapEmbedUrl: '',
  mapDirectionsUrl: 'https://maps.google.com/?q=Güzeloba+Havaalanı+Caddesi+11/D+Muratpaşa+Antalya',
  mapTitle: 'CLASS AUTO Konum',
  mapActive: true,
  // Analytics
  gtmId: '',
  ga4Id: '',
  googleAdsId: '',
  googleAdsConversionId: '',
};

/**
 * Tüm DB ayarlarını oku ve normalize et.
 * Hem `logo.main` hem `logo_main` formatını destekler.
 */
async function fetchSettingsFromDB(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    rows.forEach((r) => { map[r.key] = r.value; });

    return {
      // Logo — hem noktalı hem alt çizgili format destekle
      logoMain:    map['logo.main']    || map['logo_main']    || '',
      logoDark:    map['logo.dark']    || map['logo_dark']    || '',
      logoMobile:  map['logo.mobile']  || map['logo_mobile']  || '',
      logoFooter:  map['logo.footer']  || map['logo_footer']  || '',
      logoLight:   map['logo.light']   || map['logo_light']   || '',
      favicon:     map['logo.favicon'] || map['favicon']       || '',
      ogImage:     map['logo.og']      || map['og_image']      || '',

      // Marka
      siteTitle: map['site_title'] || DEFAULT_SETTINGS.siteTitle,
      brandName: map['brand_name'] || DEFAULT_SETTINGS.brandName,
      tagline:   map['site_tagline'] || DEFAULT_SETTINGS.tagline,

      // İletişim
      phone:           map['phone']           || '',
      phoneDisplay:    map['phone_display']   || '',
      whatsapp:        map['whatsapp']        || '',
      email:           map['email']           || DEFAULT_SETTINGS.email,
      address:         map['address']         || DEFAULT_SETTINGS.address,
      addressLandmark: map['address_landmark']|| DEFAULT_SETTINGS.addressLandmark,
      workingHours:    map['working_hours']   || DEFAULT_SETTINGS.workingHours,
      whatsappMessage: map['whatsapp_message']|| DEFAULT_SETTINGS.whatsappMessage,

      // Sosyal
      instagram: map['social_instagram'] || '',
      facebook:  map['social_facebook']  || '',
      youtube:   map['social_youtube']   || '',
      twitter:   map['social_twitter']   || '',

      // SEO
      metaTitle:           map['meta_title']           || map['seo.siteTitle']        || DEFAULT_SETTINGS.metaTitle,
      metaDesc:            map['meta_desc']            || map['seo.siteDescription']  || DEFAULT_SETTINGS.metaDesc,
      googleAnalytics:     map['google_analytics']     || '',
      googleVerification:  map['seo.googleVerification']|| '',
      canonicalBase:       map['seo.canonicalBase']    || DEFAULT_SETTINGS.canonicalBase,

      // Harita
      mapEmbedUrl:      map['map_embed_url']      || '',
      mapDirectionsUrl: map['map_directions_url'] || DEFAULT_SETTINGS.mapDirectionsUrl,
      mapTitle:         map['map_title']          || DEFAULT_SETTINGS.mapTitle,
      mapActive:        map['map_active'] !== 'false',

      // Analytics / Ads
      gtmId:                 map['gtm_id']                  || '',
      ga4Id:                 map['ga4_id']                  || '',
      googleAdsId:           map['google_ads_id']           || '',
      googleAdsConversionId: map['google_ads_conversion_id']|| '',
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Cache'li settings getter — revalidateTag('site-settings') ile temizlenir.
 */
export const getSiteSettings = unstable_cache(
  fetchSettingsFromDB,
  ['site-settings'],
  { tags: ['site-settings'], revalidate: 3600 }
);
