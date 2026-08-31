/** @type {import('next').NextConfig} */
const nextConfig = {
  // Üretimde console.log kaldır
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // Görsel optimizasyonu — AVIF/WebP, agresif cache
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 gün
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Turbopack root uyarısını gider
  turbopack: {},

  // HTTP güvenlik + cache başlıkları
  async headers() {
    return [
      // Güvenlik başlıkları — tüm sayfalar
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Font dosyaları — 1 yıl immutable cache
      {
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Statik görseller — 7 gün + stale-while-revalidate
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
      // Yüklenen görseller (uploads) — 24 saat + revalidate
      {
        source: '/uploads/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
        ],
      },
      // Next.js statik varlıkları — immutable
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // HTML sayfaları — hızlı SWR
      {
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
    ];
  },

  // Eski URL yönlendirmeleri (SEO koruma)
  async redirects() {
    return [
      {
        source: '/antalya-muratpasa-lara-ilcesi-oto-bakim-ve-tamir-hizmetleri',
        destination: '/hizmetler',
        permanent: true,
      },
      {
        source: '/antalya-muratpasa-lara-ilcesi-oto-bakim-ve-tamir-hizmetleri/',
        destination: '/hizmetler',
        permanent: true,
      },
      { source: '/wp-admin', destination: '/', permanent: false },
      { source: '/wp-login.php', destination: '/', permanent: false },
    ];
  },

  // Paket boyutunu küçült
  experimental: {
    optimizePackageImports: ['next/image'],
  },
};

export default nextConfig;
