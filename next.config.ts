/** @type {import('next').NextConfig} */
const nextConfig = {
  // Üretimde console.log kaldır
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // Görsel optimizasyonu
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 gün
    remotePatterns: [],
  },

  // HTTP güvenlik başlıkları
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Statik dosyalar için uzun süreli cache
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
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
      // Yaygın WordPress URL kalıpları
      {
        source: '/?p=:id',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-admin',
        destination: '/',
        permanent: false,
      },
      {
        source: '/wp-login.php',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
