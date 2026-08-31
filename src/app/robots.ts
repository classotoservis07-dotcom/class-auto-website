import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  const base = SITE_CONFIG.seo.siteUrl;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Geliştirme ortamında tüm taramayı engelle
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin',
          '/wp-admin',
          '/wp-login.php',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
