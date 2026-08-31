'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  group?: string;
};

const NAV: NavItem[] = [
  {
    label: 'Kontrol Paneli', href: '/admin', group: 'ana',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  },
  {
    label: 'Site Ayarları', href: '/admin/ayarlar', group: 'icerik',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  },
  {
    label: 'Ana Sayfa', href: '/admin/ana-sayfa', group: 'icerik',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    label: 'Hero Slaytları', href: '/admin/hero-slides', group: 'icerik',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="m9 12 3 2 3-2"/><line x1="3" x2="21" y1="4" y2="4"/></svg>,
  },
  {
    label: 'Hizmetler', href: '/admin/hizmetler', group: 'icerik',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  },
  {
    label: 'Çalışmalarımız', href: '/admin/calismalar', group: 'icerik',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
  },
  {
    label: 'Kampanyalar', href: '/admin/kampanyalar', group: 'icerik',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" x2="7.01" y1="7" y2="7"/></svg>,
  },
  {
    label: 'Reklam Sayfaları', href: '/admin/reklam-sayfalari', group: 'icerik',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>,
  },
  {
    label: 'Müşteri Yorumları', href: '/admin/yorumlar', group: 'icerik',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    label: 'Sık Sorulan Sorular', href: '/admin/sss', group: 'icerik',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
  },
  {
    label: 'Randevu ve Talepler', href: '/admin/talepler', group: 'musteri',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>,
  },
  {
    label: 'Reklam Raporları', href: '/admin/reklam-raporlari', group: 'musteri',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>,
  },
  {
    label: 'SEO Ayarları', href: '/admin/seo', group: 'teknik',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  },
  {
    label: 'Medya Kütüphanesi', href: '/admin/medya', group: 'teknik',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
  },
  {
    label: 'Yönlendirmeler', href: '/admin/yonlendirmeler', group: 'teknik',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3 21 7l-4 4"/><path d="M21 7H9a6 6 0 0 0 0 12h3"/></svg>,
  },
  {
    label: 'Kullanıcılar', href: '/admin/kullanicilar', group: 'sistem',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    label: 'Sistem Kayıtları', href: '/admin/kayitlar', group: 'sistem',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
];

const GROUP_LABELS: Record<string, string> = {
  ana: '',
  icerik: 'İÇERİK',
  musteri: 'MÜŞTERİ',
  teknik: 'TEKNİK',
  sistem: 'SİSTEM',
};

interface AdminSidebarProps {
  newAppointments?: number;
}

export default function AdminSidebar({ newAppointments = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const groups = ['ana', 'icerik', 'musteri', 'teknik', 'sistem'];

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: '#111827',
      borderRight: '1px solid #1f2937',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      overflowY: 'auto',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #1f2937' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#dc2626', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#f9fafb', letterSpacing: '0.05em' }}>CLASS AUTO</div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>Yönetim Paneli</div>
          </div>
        </div>
      </div>

      {/* Navigasyon */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {groups.map((group) => {
          const items = NAV.filter((n) => n.group === group);
          const label = GROUP_LABELS[group];
          return (
            <div key={group} style={{ marginBottom: '8px' }}>
              {label && (
                <div style={{ padding: '8px 12px 4px', fontSize: '11px', fontWeight: 700, color: '#4b5563', letterSpacing: '0.08em' }}>
                  {label}
                </div>
              )}
              {items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                const hasBadge = item.href === '/admin/talepler' && newAppointments > 0;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="admin-sidebar-link"
                    style={{
                      background: isActive ? '#1f2937' : undefined,
                      color: isActive ? '#ef4444' : undefined,
                    }}
                  >
                    <span style={{ color: isActive ? '#ef4444' : '#6b7280', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {hasBadge && (
                      <span style={{ background: '#dc2626', color: 'white', borderRadius: '10px', fontSize: '11px', fontWeight: 700, padding: '1px 7px', minWidth: '20px', textAlign: 'center' }}>
                        {newAppointments}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Alt kısım — çıkış */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid #1f2937' }}>
        <Link
          href="/"
          target="_blank"
          className="admin-sidebar-link"
          style={{ marginBottom: '4px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6b7280' }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          Siteyi Görüntüle
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="admin-sidebar-link"
          style={{ color: '#ef4444' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          {loggingOut ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
        </button>
      </div>
    </aside>
  );
}
