'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const STATUS_OPTIONS = [
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

type Appointment = {
  id: number;
  fullName: string;
  phone: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  plate?: string;
  serviceName?: string;
  message?: string;
  status: string;
  adminNote?: string;
  source: string;
  landingPage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  gclid?: string;
  preferredDate?: string;
  kvkkApproved: boolean;
  ipAddress?: string;
  createdAt: string;
};

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [apt, setApt] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/appointments/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setApt(data);
        setStatus(data.status);
        setAdminNote(data.adminNote ?? '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote }),
      });
      const data = await res.json();
      if (data.success) {
        setApt(data.appointment);
        setMessage({ type: 'success', text: '✓ Talep güncellendi.' });
      } else {
        setMessage({ type: 'error', text: data.error ?? 'Güncelleme başarısız.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Bağlantı hatası.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const statusInfo = STATUS_OPTIONS.find((s) => s.value === status);

  if (loading) {
    return <div style={{ padding: '32px', color: '#6b7280' }}>Yükleniyor...</div>;
  }

  if (!apt) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: '#f87171', fontSize: '18px' }}>Talep bulunamadı.</p>
        <Link href="/admin/talepler" className="admin-btn-secondary" style={{ marginTop: '16px', display: 'inline-flex' }}>
          ← Taleplere Dön
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/admin/talepler" className="admin-btn-secondary" style={{ padding: '6px 12px' }}>
            ← Geri
          </Link>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f9fafb' }}>Talep #{apt.id}</h1>
            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '2px' }}>
              {new Date(apt.createdAt).toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="admin-btn-primary">
          {saving ? 'Kaydediliyor...' : 'Güncelle'}
        </button>
      </div>

      {message && (
        <div style={{
          marginBottom: '16px', padding: '12px 16px', borderRadius: '8px',
          background: message.type === 'success' ? '#064e3b' : '#450a0a',
          color: message.type === 'success' ? '#34d399' : '#f87171',
          fontSize: '14px', fontWeight: 600,
          border: `1px solid ${message.type === 'success' ? '#065f46' : '#7f1d1d'}`,
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Müşteri Bilgileri */}
        <div className="admin-card">
          <h2 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>
            👤 Müşteri Bilgileri
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '12px' }}>Ad Soyad</p>
              <p style={{ color: '#f9fafb', fontWeight: 600, fontSize: '16px' }}>{apt.fullName}</p>
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '12px' }}>Telefon</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <a href={`tel:${apt.phone}`} className="admin-btn-primary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                  📞 {apt.phone}
                </a>
                <a href={`https://wa.me/9${apt.phone.replace(/^0/, '')}`} target="_blank" rel="noreferrer"
                  className="admin-btn-secondary" style={{ padding: '6px 14px', fontSize: '13px', background: '#064e3b', borderColor: '#065f46', color: '#34d399' }}>
                  💬 WhatsApp
                </a>
              </div>
            </div>
            {apt.kvkkApproved && (
              <div style={{ padding: '8px 12px', background: '#064e3b', borderRadius: '6px', border: '1px solid #065f46' }}>
                <p style={{ color: '#34d399', fontSize: '12px', fontWeight: 600 }}>✓ KVKK onayı alındı</p>
              </div>
            )}
          </div>
        </div>

        {/* Araç Bilgileri */}
        <div className="admin-card">
          <h2 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>
            🚗 Araç ve Hizmet
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(apt.vehicleBrand || apt.vehicleModel) && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>Araç</p>
                <p style={{ color: '#f9fafb', fontWeight: 600 }}>{apt.vehicleBrand} {apt.vehicleModel}</p>
              </div>
            )}
            {apt.plate && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>Plaka</p>
                <p style={{ color: '#f9fafb', fontWeight: 600, fontFamily: 'monospace', letterSpacing: '2px' }}>{apt.plate}</p>
              </div>
            )}
            {apt.serviceName && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>Talep Edilen Hizmet</p>
                <p style={{ color: '#f9fafb', fontWeight: 600 }}>{apt.serviceName}</p>
              </div>
            )}
            {apt.preferredDate && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>Tercih Edilen Tarih</p>
                <p style={{ color: '#f9fafb' }}>{new Date(apt.preferredDate).toLocaleDateString('tr-TR')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Müşteri Mesajı */}
        {apt.message && (
          <div className="admin-card">
            <h2 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '15px', marginBottom: '12px' }}>
              💬 Müşteri Mesajı
            </h2>
            <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{apt.message}</p>
          </div>
        )}

        {/* Kaynak/Reklam Bilgisi */}
        <div className="admin-card">
          <h2 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '15px', marginBottom: '12px' }}>
            📊 Kaynak Bilgisi
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Kaynak', value: apt.source },
              { label: 'Reklam Sayfası', value: apt.landingPage },
              { label: 'UTM Kaynak', value: apt.utmSource },
              { label: 'UTM Medya', value: apt.utmMedium },
              { label: 'UTM Kampanya', value: apt.utmCampaign },
              { label: 'GCLID', value: apt.gclid },
              { label: 'IP Adresi', value: apt.ipAddress },
            ].map(({ label, value }) => value ? (
              <div key={label} style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#6b7280', fontSize: '12px', minWidth: '100px', flexShrink: 0 }}>{label}:</span>
                <span style={{ color: '#9ca3af', fontSize: '12px', fontFamily: 'monospace' }}>{value}</span>
              </div>
            ) : null)}
          </div>
        </div>

        {/* Durum Güncelleme */}
        <div className="admin-card">
          <h2 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>
            📋 Durum Yönetimi
          </h2>
          <div>
            <label className="admin-label">Talep Durumu</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="admin-input"
              style={{ marginBottom: '16px', borderColor: statusInfo?.color ?? '#374151' }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <label className="admin-label">Yönetici Notu</label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="admin-input"
              rows={4}
              placeholder="Bu talep için dahili notunuz..."
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
