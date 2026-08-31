/**
 * CLASS AUTO — Header (Server Component)
 * DB'den logo, telefon, adres, saat bilgilerini okur.
 * Client davranışı (scroll + mobil menü) ClientHeader'a delege edilir.
 */

import { getSiteSettings } from '@/lib/site-settings';
import ClientHeader from './ClientHeader';

export const NAV_LINKS = [
  { href: '/',               label: 'Ana Sayfa' },
  { href: '/hizmetler',      label: 'Hizmetlerimiz' },
  { href: '/hakkimizda',     label: 'Hakkımızda' },
  { href: '/calismalarimiz', label: 'Çalışmalarımız' },
  { href: '/sss',            label: 'S.S.S.' },
  { href: '/iletisim',       label: 'İletişim' },
];

export default async function Header() {
  const s = await getSiteSettings();

  // Logo: ana logo (koyu zeminde çalışan) tercih edilir
  const logoSrc = s.logoMain || s.logoDark || s.logoLight || '';

  // WhatsApp URL
  const whatsappNum = s.whatsapp?.replace(/\D/g, '');
  const whatsappUrl = whatsappNum
    ? `https://wa.me/${whatsappNum}?text=${encodeURIComponent(s.whatsappMessage || 'Merhaba, randevu almak istiyorum.')}`
    : null;

  return (
    <ClientHeader
      logoSrc={logoSrc}
      logoAlt={`${s.brandName} Oto Servis Logosu`}
      brandName={s.brandName}
      navLinks={NAV_LINKS}
      whatsappUrl={whatsappUrl}
      phone={s.phone || ''}
      address={s.address || ''}
      workingHours={s.workingHours || ''}
      email={s.email || ''}
    />
  );
}
