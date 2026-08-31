import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = { title: 'Randevu ve Talepler' };

const STATUS_OPTIONS = [
  { value: '', label: 'Tümü' },
  { value: 'new', label: 'Yeni', color: '#10b981' },
  { value: 'to_call', label: 'Aranacak', color: '#f59e0b' },
  { value: 'called', label: 'Arandı', color: '#6366f1' },
  { value: 'quoted', label: 'Teklif Verildi', color: '#8b5cf6' },
  { value: 'scheduled', label: 'Randevu Oluşturuldu', color: '#0ea5e9' },
  { value: 'converted', label: 'İşe Dönüştü', color: '#22c55e' },
  { value: 'completed', label: 'Tamamlandı', color: '#64748b' },
  { value: 'cancelled', label: 'İptal', color: '#ef4444' },
  { value: 'lost', label: 'Kaybedildi', color: '#6b7280' },
];

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status ?? '';
  const page = parseInt(params.page ?? '1');
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = statusFilter ? { status: statusFilter } : {};

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }).catch(() => []),
    prisma.appointment.count({ where }).catch(() => 0),
  ]);

  const totalPages = Math.ceil(total / limit);

  const getStatusInfo = (status: string) =>
    STATUS_OPTIONS.find((s) => s.value === status) ?? { label: status, color: '#6b7280' };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f9fafb' }}>Randevu ve Talepler</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Toplam {total} talep</p>
        </div>
      </div>

      {/* Durum Filtreleri */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        {STATUS_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={`/admin/talepler${opt.value ? `?status=${opt.value}` : ''}`}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              background: statusFilter === opt.value ? (opt.color ?? '#dc2626') : '#1f2937',
              color: statusFilter === opt.value ? 'white' : '#9ca3af',
              border: `1px solid ${statusFilter === opt.value ? (opt.color ?? '#dc2626') : '#374151'}`,
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {/* Tablo */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {appointments.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>📋</p>
            <p>Bu filtreye ait talep bulunamadı.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Müşteri</th>
                  <th>Telefon</th>
                  <th>Araç</th>
                  <th>Hizmet</th>
                  <th>Kaynak</th>
                  <th>Durum</th>
                  <th>Tarih</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => {
                  const statusInfo = getStatusInfo(apt.status);
                  const vehicle = [apt.vehicleBrand, apt.vehicleModel].filter(Boolean).join(' ') || '—';
                  return (
                    <tr key={apt.id}>
                      <td style={{ color: '#6b7280', fontWeight: 600 }}>#{apt.id}</td>
                      <td>
                        <span style={{ color: '#f9fafb', fontWeight: 600 }}>{apt.fullName}</span>
                        {apt.plate && <span style={{ display: 'block', color: '#6b7280', fontSize: '12px' }}>{apt.plate}</span>}
                      </td>
                      <td>
                        <a href={`tel:${apt.phone}`} style={{ color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>
                          {apt.phone}
                        </a>
                      </td>
                      <td style={{ color: '#d1d5db' }}>{vehicle}</td>
                      <td style={{ color: '#d1d5db' }}>{apt.serviceName ?? '—'}</td>
                      <td>
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                          {apt.source}
                          {apt.utmCampaign && <span style={{ display: 'block', color: '#6b7280' }}>{apt.utmCampaign}</span>}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          background: `${statusInfo.color}20`,
                          color: statusInfo.color,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td style={{ color: '#6b7280', fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {new Date(apt.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        <Link href={`/admin/talepler/${apt.id}`} className="admin-btn-secondary" style={{ fontSize: '12px', padding: '5px 12px' }}>
                          Detay
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/talepler?${statusFilter ? `status=${statusFilter}&` : ''}page=${p}`}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                background: p === page ? '#dc2626' : '#1f2937',
                color: p === page ? 'white' : '#9ca3af',
                border: `1px solid ${p === page ? '#dc2626' : '#374151'}`,
              }}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
