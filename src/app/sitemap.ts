import { MetadataRoute } from 'next';
import { SITE_CONFIG, SERVICES } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.seo.siteUrl;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`,               lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/hizmetler`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/hakkimizda`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/calismalarimiz`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/sss`,             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/iletisim`,        lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/kvkk`,            lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/gizlilik`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/cerez-politikasi`,lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${base}/hizmetler/${service.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  return [...staticPages, ...servicePages];
}
