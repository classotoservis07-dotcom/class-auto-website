import type { Metadata } from 'next';
import Link from 'next/link';
import { SERVICES, FAQ_ITEMS } from '@/lib/config';
import { generatePageMetadata } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/site-settings';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import CampaignBanner from '@/components/sections/CampaignBanner';
import QuickServices from '@/components/sections/QuickServices';
import ContactMapSection from '@/components/sections/ContactMapSection';
import HeroSlider from '@/components/sections/HeroSlider';
import BrandLogos from '@/components/sections/BrandLogos';
import WorksGallery from '@/components/sections/WorksGallery';

export const metadata: Metadata = generatePageMetadata({
  title: 'CLASS AUTO — Antalya Oto Servis | Muratpaşa Güzeloba',
  description:
    "Antalya Muratpaşa Güzeloba'da profesyonel oto servis. Mekanik, kaporta-boya, oto elektrik, klima bakımı, lastik değişimi ve bilgisayarlı arıza tespiti. CLASS AUTO güvencesiyle.",
  keywords: [
    'Antalya oto servis',
    'Muratpaşa oto servis',
    'Güzeloba oto servis',
    'Lara oto servis',
    'Antalya oto tamir',
  ],
});

// ── DB sorguları (cache'li) ──────────────────────────────────────────────────

const getHero = unstable_cache(
  async () => prisma.heroSection.findFirst(),
  ['hero-section'],
  { tags: ['hero'], revalidate: 3600 }
);

const getFeaturedWorks = unstable_cache(
  async () =>
    prisma.work.findMany({
      where: { status: 'published', showOnHome: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 6,
    }),
  ['featured-works'],
  { tags: ['works'], revalidate: 3600 }
);

const getHomeReviews = unstable_cache(
  async () =>
    prisma.review.findMany({
      where: { isApproved: true, showOnHome: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 6,
    }),
  ['home-reviews'],
  { tags: ['reviews'], revalidate: 3600 }
);

const getHomeFaqs = unstable_cache(
  async () =>
    prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      take: 6,
    }),
  ['home-faqs'],
  { tags: ['faqs'], revalidate: 3600 }
);

// ── Static data ──────────────────────────────────────────────────────────────

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  Wrench: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  Zap: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  PaintBucket: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m19 11-8-8-8.5 8.5a5.5 5.5 0 0 0 7.78 7.78L19 11z"/><path d="m19 11 2 2a2.5 2.5 0 0 1 0 3.5"/><path d="M20.5 16.5c.5.5.5 1 .5 1.5a2 2 0 0 1-2 2c-.5 0-1-.25-1.5-.5"/>
    </svg>
  ),
  CircleDot: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Wind: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
    </svg>
  ),
  Circle: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Search: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
};

const WHY_ITEMS = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Deneyimli Uzman Ekip',
    desc: 'Alanında uzman, deneyimli teknisyenlerimiz aracınızı özenle inceler.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>,
    title: 'Modern Teşhis Ekipmanları',
    desc: 'Güncel OBD ve teşhis sistemleriyle arızalar hızla ve doğru biçimde tespit edilir.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'İşlem Öncesi Bilgilendirme',
    desc: 'Herhangi bir işlem başlamadan önce maliyet ve süreyi sizinle paylaşırız.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'Kaliteli Parça ve İşçilik',
    desc: 'Güvenilir parçalar ve titiz işçilik anlayışıyla her servis kalıcı çözüm sunar.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    title: 'Zamanında Teslimat',
    desc: 'Söz verilen teslim süresine uygun çalışıyor, bekleme sürelerinizi minimize ediyoruz.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    title: 'Müşteri Memnuniyeti Odaklı',
    desc: 'Servis öncesi, sırası ve sonrasında yanınızdayız. Memnuniyetiniz önceliğimizdir.',
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Randevu ve Araç Kabul', desc: 'Telefonla, WhatsApp üzerinden veya formla randevu alın. Aracınızı belirtilen saatte servisimize bırakın.' },
  { step: '02', title: 'Kontrol ve Arıza Tespiti', desc: 'Uzman teknisyenlerimiz aracınızı kapsamlı biçimde inceler; gerekirse bilgisayarlı teşhis uygular.' },
  { step: '03', title: 'Bilgilendirme ve Onay', desc: 'Tespit edilen sorunları, gerekli işlemleri ve tahmini maliyeti sizinle paylaşırız. İzniniz olmadan başlamayız.' },
  { step: '04', title: 'Onarım ve Teslimat', desc: 'Onarım tamamlandıktan sonra son kontrol yapılır. Aracınız temiz ve eksiksiz şekilde teslim edilir.' },
];


const getHeroSlides = unstable_cache(
  async () => prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  }),
  ['hero-slides'],
  { tags: ['hero'], revalidate: 3600 }
);

// ── Page ─────────────────────────────────────────────────────────────────────

const getServices = unstable_cache(
  async () => prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  }),
  ['services-list'],
  { tags: ['services'], revalidate: 3600 }
);

export default async function HomePage() {
  const [hero, heroSlidesDB, settings, featuredWorks, reviews, dbFaqs, dbServices] = await Promise.all([
    getHero().catch(() => null),
    getHeroSlides().catch(() => []),
    getSiteSettings().catch(() => null),
    getFeaturedWorks().catch(() => []),
    getHomeReviews().catch(() => []),
    getHomeFaqs().catch(() => []),
    getServices().catch(() => []),
  ]);

  const services = dbServices.length > 0 ? dbServices : SERVICES;

  // WhatsApp URL
  const waNum = settings?.whatsapp?.replace(/\D/g, '');
  const whatsappUrl = waNum
    ? `https://wa.me/${waNum}?text=${encodeURIComponent(settings?.whatsappMessage || 'Merhaba, randevu almak istiyorum.')}`
    : '/iletisim';

  // Hero slider: DB'den yoksa 3 default slide (slide 1 HeroSection'dan)
  const heroSlides = heroSlidesDB.length > 0 ? heroSlidesDB : [
    {
      id: 1,
      sortOrder: 0,
      isActive: true,
      title: hero?.title || "Antalya Muratpaşa'da Profesyonel Oto Servis",
      subtitle: hero?.subtitle || 'Mekanikten kaporta ve boyaya, arıza tespitinden lastik hizmetlerine kadar aracınızın tüm ihtiyaçları CLASS AUTO güvencesiyle tek noktada.',
      bgImage: hero?.desktopImage || null,
      overlayOpacity: hero?.overlayOpacity ?? 55,
      btn1Text: hero?.btn1Text || "WhatsApp'tan Randevu Al",
      btn1Url: whatsappUrl,
      btn2Text: 'Hizmetlerimizi İncele',
      btn2Url: '/hizmetler',
      badgeText: 'Antalya Muratpaşa — Güzeloba',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      sortOrder: 1,
      isActive: true,
      title: 'Kaporta, Boya ve Güvenilir Onarım',
      subtitle: 'Küçük çarpma izlerinden büyük kaporta hasarlarına kadar aracınızı uzman ekibimizle orijinal görünümüne kavuşturuyoruz.',
      bgImage: null,
      overlayOpacity: 55,
      btn1Text: "WhatsApp'tan Randevu Al",
      btn1Url: whatsappUrl,
      btn2Text: 'Kaporta & Boya',
      btn2Url: '/hizmetler/kaporta-boya',
      badgeText: 'Boyasız Göçük · Kaporta · Boya',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      sortOrder: 2,
      isActive: true,
      title: 'Bilgisayarlı Arıza Tespit ve Oto Elektrik',
      subtitle: 'Modern teşhis ekipmanlarıyla aracınızın arızasını hızla tespit ediyor, oto elektrik sorunlarını köklü biçimde çözüyoruz.',
      bgImage: null,
      overlayOpacity: 55,
      btn1Text: "WhatsApp'tan Randevu Al",
      btn1Url: whatsappUrl,
      btn2Text: 'Arıza Tespit',
      btn2Url: '/hizmetler/ariza-tespit',
      badgeText: 'OBD2 · Komponent Testi · Oto Elektrik',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // FAQ: prefer DB, fallback to config
  const faqItems = dbFaqs.length > 0
    ? dbFaqs.map((f) => ({ q: f.question, a: f.answer }))
    : FAQ_ITEMS.slice(0, 6);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO SLIDER
      ═══════════════════════════════════════════════════════════════════ */}
      <HeroSlider
        slides={heroSlides}
        phone={settings?.phone || ''}
        whatsapp={settings?.whatsapp || ''}
        whatsappMessage={settings?.whatsappMessage || 'Merhaba, randevu almak istiyorum.'}
        height="92vh"
      />

      {/* ═══════════════════════════════════════════════════════════════════
          CAMPAIGN BANNER (conditional)
      ═══════════════════════════════════════════════════════════════════ */}
      <CampaignBanner />

      {/* ═══════════════════════════════════════════════════════════════════
          QUICK SERVICE SELECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <QuickServices />

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN SERVICES GRID
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-py" style={{ background: '#F5F6F7' }} aria-labelledby="services-heading">
        <div className="container-site">
          <div className="section-header" style={{ color: '#1D252D' }}>
            <h2 id="services-heading" style={{ color: '#1D252D' }}>
              <span style={{ color: '#E30613' }}>Profesyonel</span> Oto Servis Hizmetleri
            </h2>
            <p style={{ color: '#66717C' }}>
              Aracınızın ihtiyaç duyduğu tüm bakım ve onarım hizmetlerini deneyimli ekibimizle sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service) => {
              const href = service.slug.startsWith('/') ? service.slug : `/hizmetler/${service.slug}`;
              return (
              <Link
                key={service.id}
                href={href}
                style={{
                  display: 'block',
                  background: '#FFFFFF',
                  border: '1px solid #E2E6EA',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                  color: '#1D252D',
                }}
                className="service-card-light"
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(227,6,19,0.08)', border: '1px solid rgba(227,6,19,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E30613', marginBottom: '16px' }}>
                  {SERVICE_ICONS[service.icon || 'Wrench'] || SERVICE_ICONS['Wrench']}
                </div>
                <h3 style={{ color: '#1D252D', fontWeight: 700, marginBottom: '8px', fontSize: '15px', fontFamily: 'Oswald, Arial Narrow, sans-serif' }}>
                  {service.title}
                </h3>
                <p style={{ color: '#66717C', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '16px' }}>
                  {'shortDesc' in service ? service.shortDesc : service.description}
                </p>
                <span style={{ color: '#E30613', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Detaylı İncele
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </Link>
            )})}
          </div>

          <style>{`
            .service-card-light:hover {
              border-color: rgba(227,6,19,0.3) !important;
              transform: translateY(-3px);
              box-shadow: 0 8px 24px rgba(227,6,19,0.08);
            }
          `}</style>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          NEDEN CLASS AUTO?
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-py" style={{ background: '#FFFFFF' }} aria-labelledby="why-heading">
        <div className="container-site">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
            className="why-grid">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                style={{ border: '1px solid rgba(227,6,19,0.3)', background: 'rgba(227,6,19,0.05)' }}>
                <span style={{ color: '#E30613', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neden CLASS AUTO?</span>
              </div>
              <h2 id="why-heading" style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 700, color: '#1D252D', marginBottom: '16px' }}>
                Aracınızı Neden{' '}
                <span style={{ color: '#E30613' }}>CLASS AUTO</span>{'\'ya'} Emanet Etmelisiniz?
              </h2>
              <p style={{ color: '#66717C', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Her araç sahibi, güvendiği ve şeffaf çalışan bir servis hak eder. Biz tam da bu anlayışla çalışıyoruz.
              </p>
              <Link href="/iletisim" className="btn-primary">Randevu Al</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {WHY_ITEMS.map((item) => (
                <div
                  key={item.title}
                  style={{ background: '#F5F6F7', border: '1px solid #E2E6EA', borderRadius: '12px', padding: '20px', transition: 'border-color 0.2s ease' }}
                  className="why-card"
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(227,6,19,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E30613', marginBottom: '12px' }}>
                    {item.icon}
                  </div>
                  <h3 style={{ color: '#1D252D', fontWeight: 700, fontSize: '14px', marginBottom: '6px', fontFamily: 'Oswald, Arial Narrow, sans-serif' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#66717C', fontSize: '13px', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          .why-grid { grid-template-columns: 1fr 1fr; }
          @media (max-width: 1023px) { .why-grid { grid-template-columns: 1fr; } }
          .why-card:hover { border-color: rgba(227,6,19,0.25) !important; }
          .hero-grid { grid-template-columns: 1fr 1fr; }
          @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          NASIL ÇALIŞIYORUZ?
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-py" style={{ background: '#F5F6F7' }} aria-labelledby="process-heading">
        <div className="container-site">
          <div className="section-header">
            <h2 id="process-heading" style={{ color: '#1D252D' }}>
              Nasıl <span style={{ color: '#E30613' }}>Çalışıyoruz?</span>
            </h2>
            <p style={{ color: '#66717C' }}>Aracınıza verdiğimiz hizmeti 4 adımda şeffaf biçimde yönetiyoruz.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line — desktop */}
            <div className="hidden lg:block absolute" aria-hidden="true"
              style={{ top: '32px', left: '12.5%', right: '12.5%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(227,6,19,0.35), transparent)' }} />

            {PROCESS_STEPS.map((step) => (
              <div key={step.step} className="relative text-center p-6">
                <div
                  className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ background: '#E30613', fontFamily: 'Oswald, Arial Narrow, sans-serif', position: 'relative', zIndex: 10 }}
                >
                  {step.step}
                </div>
                <h3 style={{ color: '#1D252D', fontWeight: 700, marginBottom: '8px', fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '15px' }}>
                  {step.title}
                </h3>
                <p style={{ color: '#66717C', fontSize: '14px', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ÇALIŞMALARIMIZ GALERİ (from DB)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-py" style={{ background: '#FFFFFF' }} aria-labelledby="works-heading">
        <div className="container-site">
          <div className="section-header">
            <h2 id="works-heading" style={{ color: '#1D252D' }}>
              Öne Çıkan <span style={{ color: '#E30613' }}>Çalışmalarımız</span>
            </h2>
            <p style={{ color: '#66717C' }}>Fotoğrafa tıklayarak büyütebilirsiniz.</p>
          </div>

          {featuredWorks.length > 0 ? (
            <>
              <WorksGallery works={featuredWorks} />
              <div className="text-center mt-10">
                <Link href="/calismalarimiz" className="btn-secondary" style={{ borderColor: '#E2E6EA', color: '#1D252D' }}>
                  Tüm Çalışmaları Gör →
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9CA3AF' }}>
              <p>Yönetim panelinden çalışma eklendiğinde burada görüntülenecektir.</p>
              <div style={{ marginTop: '16px' }}>
                <Link href="/calismalarimiz" className="btn-secondary" style={{ borderColor: '#E2E6EA', color: '#1D252D' }}>
                  Galeriye Git
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          MARKALAR — Animasyonlu Logo Şeridi
      ═══════════════════════════════════════════════════════════════════ */}
      <BrandLogos />

      {/* ═══════════════════════════════════════════════════════════════════
          YORUMLAR (from DB)
      ═══════════════════════════════════════════════════════════════════ */}
      {reviews.length > 0 && (
        <section className="section-py" style={{ background: '#F5F6F7' }} aria-labelledby="reviews-heading">
          <div className="container-site">
            <div className="section-header">
              <h2 id="reviews-heading" style={{ color: '#1D252D' }}>
                Müşteri <span style={{ color: '#E30613' }}>Yorumları</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{ background: '#FFFFFF', border: '1px solid #E2E6EA', borderRadius: '12px', padding: '1.5rem' }}
                >
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }} aria-label={`${review.rating} yıldız`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill={i < review.rating ? '#F59E0B' : '#E2E6EA'} aria-hidden="true">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  <p style={{ color: '#1D252D', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px', fontStyle: 'italic' }}>
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <p style={{ color: '#E30613', fontWeight: 700, fontSize: '13px' }}>{review.authorName}</p>
                  {review.source && review.source !== 'form' && (
                    <p style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '3px', textTransform: 'capitalize' }}>{review.source}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SSS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-py" style={{ background: '#FFFFFF' }} aria-labelledby="faq-heading">
        <div className="container-site" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <h2 id="faq-heading" style={{ color: '#1D252D' }}>
              Sık Sorulan <span style={{ color: '#E30613' }}>Sorular</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
            {faqItems.map((item) => (
              <details
                key={item.q}
                style={{ background: '#F5F6F7', border: '1px solid #E2E6EA', borderRadius: '10px', overflow: 'hidden' }}
                className="faq-item"
              >
                <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 20px', cursor: 'pointer', listStyle: 'none', color: '#1D252D', fontWeight: 600, fontSize: '15px' }}>
                  {item.q}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </summary>
                <div style={{ padding: '0 20px 16px', color: '#66717C', fontSize: '14px', lineHeight: 1.7, borderTop: '1px solid #E2E6EA' }}>
                  <p style={{ paddingTop: '12px' }}>{item.a}</p>
                </div>
              </details>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/sss" className="btn-secondary" style={{ borderColor: '#E2E6EA', color: '#1D252D' }}>
              Tüm Soruları Görüntüle
            </Link>
          </div>
        </div>
        <style>{`
          .faq-item[open] summary svg { transform: rotate(45deg); }
          .faq-item summary svg { transition: transform 0.2s ease; }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #B8040E 0%, #E30613 50%, #B8040E 100%)' }}
        aria-labelledby="cta-heading"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container-site relative text-center">
          <h2 id="cta-heading" style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            Aracınızın Bakımını Ertelemeyin
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Randevunuzu oluşturun, aracınızı uzman ekibimizle birlikte kontrol edelim.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={whatsappUrl}
              target={whatsappUrl.startsWith('http') ? '_blank' : undefined}
              rel={whatsappUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.75rem', background: '#FFFFFF', color: '#E30613', fontWeight: 700, borderRadius: '8px', fontSize: '0.9375rem', textDecoration: 'none' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp&apos;tan Yaz
            </a>
            {settings?.phone?.trim() ? (
              <a
                href={`tel:${(settings?.phone || '').replace(/\s/g, '')}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.75rem', background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 700, borderRadius: '8px', fontSize: '0.9375rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)' }}
                aria-label="Hemen Ara"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Hemen Ara
              </a>
            ) : (
              <Link
                href="/iletisim"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.75rem', background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 700, borderRadius: '8px', fontSize: '0.9375rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                İletişim Formu
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CONTACT + MAP (id="iletisim-harita")
      ═══════════════════════════════════════════════════════════════════ */}
      <ContactMapSection />
    </>
  );
}
