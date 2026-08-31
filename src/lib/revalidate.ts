/**
 * revalidateAll — Admin panelinden kayıt yapılınca ilgili tag'leri temizler.
 * Ziyaretçi sitesinin cache'i anında güncellenir.
 *
 * Kullanım:
 *   import { revalidateSite } from '@/lib/revalidate';
 *   revalidateSite('settings');    // Site ayarları değişince
 *   revalidateSite('hero');        // Hero/slider değişince
 *   revalidateSite('works');       // Çalışmalar değişince
 *   revalidateSite('campaigns');   // Kampanya değişince
 *   revalidateSite('faqs');        // SSS değişince
 *   revalidateSite('reviews');     // Yorumlar değişince
 */

import { revalidateTag, revalidatePath } from 'next/cache';

type RevalidateKey =
  | 'settings'
  | 'hero'
  | 'works'
  | 'campaigns'
  | 'faqs'
  | 'reviews'
  | 'services'
  | 'all';

const TAG_MAP: Record<RevalidateKey, string[]> = {
  settings: ['settings', 'hero', 'hero-section'],
  hero: ['hero', 'hero-section', 'hero-slides'],
  works: ['works'],
  campaigns: ['campaigns'],
  faqs: ['faqs'],
  reviews: ['reviews'],
  services: ['services'],
  all: ['settings', 'hero', 'hero-section', 'hero-slides', 'works', 'campaigns', 'faqs', 'reviews', 'services'],
};

export function revalidateSite(key: RevalidateKey = 'all') {
  const tags = TAG_MAP[key] ?? TAG_MAP.all;
  try {
    tags.forEach((tag) => {
      try {
        revalidateTag(tag, 'max');
      } catch { /* ignore */ }
    });

    // Ana sayfa her zaman yenile
    try { revalidatePath('/', 'page'); } catch { /* ignore */ }

    // Key'e göre ek path'ler
    if (key === 'works' || key === 'all') {
      try { revalidatePath('/calismalarimiz', 'page'); } catch { /* ignore */ }
    }
    if (key === 'faqs' || key === 'all') {
      try { revalidatePath('/sss', 'page'); } catch { /* ignore */ }
    }
    if (key === 'services' || key === 'all') {
      try { revalidatePath('/hizmetler', 'page'); } catch { /* ignore */ }
    }
  } catch {
    // revalidation hatası sayfayı çökertmesin
  }
}
