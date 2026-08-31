import { SITE_CONFIG } from '@/lib/config';
import type { Metadata } from 'next';

const { seo, brand, tracking } = SITE_CONFIG;

/** Otomatik JSON-LD LocalBusiness + AutoRepair schema */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['AutoRepair', 'LocalBusiness'],
    name: brand.name,
    description: seo.defaultDescription,
    url: seo.siteUrl,
    logo: `${seo.siteUrl}${brand.logoPath}`,
    image: `${seo.siteUrl}${seo.ogImage}`,
    telephone: SITE_CONFIG.contact.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Güzeloba Mahallesi Havaalanı Caddesi No:11/D',
      addressLocality: 'Muratpaşa',
      addressRegion: 'Antalya',
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      // Koordinatlar işletme sahibinden alındıktan sonra güncellenecek
      latitude: 36.8969,
      longitude: 30.7133,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    priceRange: '₺₺',
    currenciesAccepted: 'TRY',
    paymentAccepted: 'Cash, Credit Card',
    areaServed: ['Antalya', 'Muratpaşa', 'Lara', 'Güzeloba', 'Konyaaltı', 'Kepez'],
    hasMap: SITE_CONFIG.address.googleMapsUrl,
    sameAs: [seo.siteUrl, SITE_CONFIG.address.googleBusinessUrl].filter(Boolean),
    serviceType: [
      'Mekanik Bakım', 'Oto Elektrik', 'Kaporta Onarımı', 'Oto Boya',
      'Boyasız Göçük Düzeltme', 'Klima Bakımı', 'Lastik Değişimi', 'Bilgisayarlı Arıza Tespiti',
    ],
  };
}

/** Sayfa metadata oluşturucu */
export function generatePageMetadata(opts: {
  title: string;
  description: string;
  slug?: string;
  keywords?: string[];
  noindex?: boolean;
}): Metadata {
  const url = opts.slug ? `${seo.siteUrl}/${opts.slug}` : seo.siteUrl;

  return {
    title: opts.title,
    description: opts.description,
    keywords: [...(opts.keywords ?? []), ...seo.keywords].join(', '),
    robots: opts.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: brand.name,
      locale: seo.locale,
      type: 'website',
      images: [{
        url: `${seo.siteUrl}${seo.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${brand.name} — ${opts.title}`,
      }],
    },
    twitter: {
      card: seo.twitterCard,
      title: opts.title,
      description: opts.description,
      images: [`${seo.siteUrl}${seo.ogImage}`],
    },
    verification: {
      google: tracking.searchConsoleVerification || undefined,
    },
  };
}
