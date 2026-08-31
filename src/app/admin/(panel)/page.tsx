import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = { title: 'Kontrol Paneli' };

// Stat ve quickAction hover'ları için Client bileşeni
import DashboardCards from '@/components/admin/DashboardCards';

export default async function AdminDashboard() {
  const [
    totalServices,
    totalWorks,
    totalAppointments,
    newAppointments,
    totalFAQs,
    recentAppointments,
  ] = await Promise.all([
    prisma.service.count().catch(() => 0),
    prisma.work.count().catch(() => 0),
    prisma.appointment.count().catch(() => 0),
    prisma.appointment.count({ where: { status: 'new' } }).catch(() => 0),
    prisma.fAQ.count().catch(() => 0),
    prisma.appointment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, fullName: true, serviceName: true, status: true, createdAt: true, phone: true },
    }).catch(() => []),
  ]);

  const statusLabels: Record<string, { label: string; color: string }> = {
    new:       { label: 'Yeni',               color: '#10b981' },
    to_call:   { label: 'Aranacak',           color: '#f59e0b' },
    called:    { label: 'Arandı',             color: '#6366f1' },
    quoted:    { label: 'Teklif Verildi',     color: '#8b5cf6' },
    scheduled: { label: 'Randevu Oluşturuldu',color: '#0ea5e9' },
    converted: { label: 'İşe Dönüştü',       color: '#22c55e' },
    completed: { label: 'Tamamlandı',         color: '#64748b' },
    cancelled: { label: 'İptal',              color: '#ef4444' },
    lost:      { label: 'Kaybedildi',         color: '#6b7280' },
  };

  const stats = [
    { label: 'Toplam Hizmet',   value: totalServices,      icon: '🔧', href: '/admin/hizmetler', color: '#3b82f6' },
    { label: 'Çalışma Galerisi',value: totalWorks,         icon: '🚗', href: '/admin/calismalar', color: '#8b5cf6' },
    { label: 'Toplam Talep',    value: totalAppointments,  icon: '📋', href: '/admin/talepler',   color: '#f59e0b' },
    { label: 'Yeni Talepler',   value: newAppointments,    icon: '🔔', href: '/admin/talepler',   color: '#ef4444' },
  ];

  const quickActions = [
    { label: 'Yeni Çalışma Ekle', href: '/admin/calismalar/yeni', icon: '📸' },
    { label: 'Hizmet Düzenle',    href: '/admin/hizmetler',       icon: '🔧' },
    { label: 'Site Ayarları',     href: '/admin/ayarlar',         icon: '⚙️' },
    { label: 'Logo Yükle',        href: '/admin/ayarlar?tab=logo',icon: '🖼️' },
    { label: 'Hero Yönet',        href: '/admin/ana-sayfa',       icon: '🏠' },
    { label: 'Reklam Sayfası',    href: '/admin/reklam-sayfalari/yeni', icon: '📣' },
  ];

  return (
    <div style={{ padding: '32px' }}>
      {/* Başlık */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f9fafb', marginBottom: '4px' }}>Kontrol Paneli</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>CLASS AUTO Yönetim Sistemine Hoş Geldiniz</p>
      </div>

      {/* Yeni talep uyarısı */}
      {newAppointments > 0 && (
        <div style={{ marginBottom: '24px', padding: '16px 20px', background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <div>
              <p style={{ color: '#fca5a5', fontWeight: 600, fontSize: '15px' }}>{newAppointments} yeni randevu talebi var!</p>
              <p style={{ color: '#f87171', fontSize: '13px' }}>Müşteri taleplerini kaçırmayın.</p>
            </div>
          </div>
          <Link href="/admin/talepler" className="admin-btn-primary">
            Talepleri Gör
          </Link>
        </div>
      )}

      {/* İstatistik Kartları + Hızlı İşlemler — Client Component (hover için) */}
      <DashboardCards stats={stats} quickActions={quickActions} />

      {/* Son Talepler — pure static, Server Component olarak kalıyor */}
      <div className="admin-card" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f9fafb' }}>Son Talepler</h2>
          <Link href="/admin/talepler" style={{ color: '#dc2626', fontSize: '13px', textDecoration: 'none' }}>Tümünü Gör →</Link>
        </div>
        {recentAppointments.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>Henüz talep yok.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentAppointments.map((apt) => {
              const statusInfo = statusLabels[apt.status] ?? { label: apt.status, color: '#6b7280' };
              return (
                <Link key={apt.id} href={`/admin/talepler/${apt.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#111827', borderRadius: '8px', border: '1px solid #1f2937' }}>
                    <div>
                      <p style={{ color: '#f9fafb', fontSize: '14px', fontWeight: 600 }}>{apt.fullName}</p>
                      <p style={{ color: '#6b7280', fontSize: '12px' }}>{apt.serviceName ?? 'Hizmet belirtilmedi'} · {apt.phone}</p>
                    </div>
                    <span style={{ background: `${statusInfo.color}20`, color: statusInfo.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {statusInfo.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
