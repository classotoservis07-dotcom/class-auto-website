import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = { title: 'Hizmet Yönetimi' };

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: 'asc' },
  }).catch(() => []);

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f9fafb' }}>Hizmet Yönetimi</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>{services.length} hizmet • Her hizmet için otomatik sayfa oluşturulur</p>
        </div>
        <Link href="/admin/hizmetler/yeni" className="admin-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Yeni Hizmet
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sıra</th>
              <th>Hizmet Adı</th>
              <th>URL (Slug)</th>
              <th>Kısa Açıklama</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>
                  <span style={{ color: '#6b7280', fontWeight: 700, fontSize: '13px' }}>#{service.sortOrder}</span>
                </td>
                <td>
                  <span style={{ color: '#f9fafb', fontWeight: 600 }}>{service.title}</span>
                </td>
                <td>
                  <code style={{ color: '#6b7280', fontSize: '12px', fontFamily: 'monospace' }}>
                    /hizmetler/{service.slug}
                  </code>
                </td>
                <td>
                  <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                    {service.shortDesc.length > 60 ? service.shortDesc.slice(0, 60) + '...' : service.shortDesc}
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${service.isActive ? 'admin-badge-green' : 'admin-badge-gray'}`}>
                    {service.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={`/admin/hizmetler/${service.id}`}
                      className="admin-btn-secondary"
                      style={{ fontSize: '12px', padding: '5px 12px' }}
                    >
                      Düzenle
                    </Link>
                    <Link
                      href={`/hizmetler/${service.slug}`}
                      target="_blank"
                      className="admin-btn-secondary"
                      style={{ fontSize: '12px', padding: '5px 12px' }}
                    >
                      Görüntüle
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
