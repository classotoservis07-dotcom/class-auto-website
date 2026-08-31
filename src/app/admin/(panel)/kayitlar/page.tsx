import { prisma } from '@/lib/prisma';

export const metadata = { title: 'Sistem Kayıtları' };

export default async function LogsPage() {
  const logs = await prisma.activityLog.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } },
  }).catch(() => []);

  const actionLabels: Record<string, string> = {
    login: 'Giriş yapıldı',
    logout: 'Çıkış yapıldı',
    settings_updated: 'Ayarlar güncellendi',
    hero_updated: 'Hero güncellendi',
    appointment_updated: 'Talep güncellendi',
    service_updated: 'Hizmet güncellendi',
    work_created: 'Çalışma eklendi',
    work_updated: 'Çalışma güncellendi',
    work_deleted: 'Çalışma silindi',
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f9fafb' }}>Sistem Kayıtları</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Son 100 sistem aktivitesi</p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {logs.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>📋</p>
            <p>Henüz sistem kaydı yok.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tarih/Saat</th>
                <th>İşlem</th>
                <th>Hedef</th>
                <th>Kullanıcı</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ color: '#6b7280', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString('tr-TR', {
                      day: '2-digit', month: '2-digit', year: '2-digit',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td>
                    <span style={{ color: '#f9fafb', fontSize: '14px' }}>
                      {actionLabels[log.action] ?? log.action}
                    </span>
                    {log.detail && <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>{log.detail}</p>}
                  </td>
                  <td style={{ color: '#9ca3af', fontSize: '13px' }}>{log.target ?? '—'}</td>
                  <td style={{ color: '#9ca3af', fontSize: '13px' }}>
                    {log.user ? log.user.name : '—'}
                  </td>
                  <td style={{ color: '#6b7280', fontSize: '12px', fontFamily: 'monospace' }}>{log.ipAddress ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
