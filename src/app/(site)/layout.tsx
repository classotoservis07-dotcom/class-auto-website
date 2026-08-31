import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { generateLocalBusinessSchema } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/site-settings';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingContactButtons from '@/components/ui/FloatingContactButtons';
import GTMScript from '@/components/analytics/GTMScript';
import ConversionTracker from '@/components/analytics/ConversionTracker';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.seo.defaultTitle,
    template: SITE_CONFIG.seo.titleTemplate,
  },
  description: SITE_CONFIG.seo.defaultDescription,
  authors: [{ name: SITE_CONFIG.brand.name }],
  creator: SITE_CONFIG.brand.name,
  metadataBase: new URL(SITE_CONFIG.seo.siteUrl),
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.seo.locale,
    url: SITE_CONFIG.seo.siteUrl,
    siteName: SITE_CONFIG.brand.name,
    title: SITE_CONFIG.seo.defaultTitle,
    description: SITE_CONFIG.seo.defaultDescription,
  },
  robots: {
    index: process.env.NODE_ENV === 'production',
    follow: process.env.NODE_ENV === 'production',
  },
};

// (site) layout — ZİYARETÇİ sayfaları için
// <html> ve <body> ROOT layout'ta açılıyor, burada KULLANILMAZ
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const schema = generateLocalBusinessSchema();
  const s = await getSiteSettings();

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <GTMScript gtmId={s.gtmId || ''} />
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <FloatingContactButtons
        phone={s.phone || ''}
        whatsapp={s.whatsapp || ''}
        whatsappMessage={s.whatsappMessage || 'Merhaba, randevu almak istiyorum.'}
        appointmentUrl="/iletisim"
      />
      <ConversionTracker />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#E30613] focus:text-white focus:rounded-lg focus:font-semibold"
      >
        İçeriğe atla
      </a>
    </>
  );
}
