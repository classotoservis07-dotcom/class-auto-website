'use client';
import { useState, useEffect } from 'react';
import MediaPicker from '@/components/admin/MediaPicker';

type Item = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  image: string | null;
  badge: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  showOnHome: boolean;
  status: string;
  bannerColor: string | null;
  terms: string | null;
  relatedService: string | null;
  landingPageUrl: string | null;
  sortOrder: number;
};

const emptyForm = {
  title: '',
  description: '',
  imageUrl: '',
  badge: '',
  buttonText: '',
  buttonUrl: '',
  ctaText: '',
  ctaUrl: '',
  startDate: '',
  endDate: '',
  isActive: true,
  showOnHome: false,
  status: 'draft',
  bannerColor: '#202A34',
  terms: '',
  relatedService: '',
  landingPageUrl: '',
  sortOrder: 0,
};

const SERVICES = [
  { id: 'periyodik-bakim', name: 'Periyodik Bakım' },
  { id: 'mekanik-bakim', name: 'Mekanik Bakım ve Onarım' },
  { id: 'oto-elektrik', name: 'Oto Elektrik ve Elektronik' },
  { id: 'ariza-tespit', name: 'Bilgisayarlı Arıza Tespiti' },
  { id: 'kaporta-boya', name: 'Kaporta ve Boya' },
  { id: 'boyasiz-gocuk-duzeltme', name: 'Boyasız Göçük Düzeltme' },
  { id: 'klima-bakimi', name: 'Klima Bakımı ve Gaz Dolumu' },
  { id: 'oto-lastik', name: 'Oto Lastik ve Balans' },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#9ca3af', marginBottom: '6px' }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = 'text', placeholder = '' }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="admin-input"
      placeholder={placeholder}
    />
  );
}

export default function KampanyalarPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/kampanyalar?all=1');
      const data = await res.json();
      setItems(data.campaigns ?? []);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const startEdit = (item: Item) => {
    setForm({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl || item.image || '',
      badge: item.badge || '',
      buttonText: item.buttonText || item.ctaText || '',
      buttonUrl: item.buttonUrl || item.ctaUrl || '',
      ctaText: item.ctaText || '',
      ctaUrl: item.ctaUrl || '',
      startDate: item.startDate ? new Date(item.startDate).toISOString().slice(0, 10) : '',
      endDate: item.endDate ? new Date(item.endDate).toISOString().slice(0, 10) : '',
      isActive: item.isActive,
      showOnHome: item.showOnHome,
      status: item.status || 'draft',
      bannerColor: item.bannerColor || '#202A34',
      terms: item.terms || '',
      relatedService: item.relatedService || '',
      landingPageUrl: item.landingPageUrl || '',
      sortOrder: item.sortOrder,
    });
    setEditId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startNew = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const f = (key: keyof typeof emptyForm) => (v: string | boolean | number) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const submitData: Record<string, unknown> = {
      ...form,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    };
    try {
      const res = await fetch('/api/admin/kampanyalar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editId ? { id: editId, ...submitData } : submitData),
      });
      const data = await res.json();
      if (data.success) { showMsg('success', 'Kaydedildi.'); setShowForm(false); load(); }
      else showMsg('error', data.error ?? 'Hata oluştu.');
    } catch { showMsg('error', 'Bağlantı hatası.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/kampanyalar?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { showMsg('success', 'Silindi.'); load(); }
      else showMsg('error', data.error ?? 'Silinemedi.');
    } catch { showMsg('error', 'Bağlantı hatası.'); }
    finally { setDeleting(null); }
  };

  const inputStyle = { background: '#1a2535', border: '1px solid #374151', borderRadius: '8px', padding: '8px 12px', color: '#f9fafb', fontSize: '14px', width: '100%' };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f9fafb' }}>Kampanyalar</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Aktif kampanyaları ve banner içeriklerini yönetin.</p>
        </div>
        <button onClick={startNew} className="admin-btn-primary">+ Yeni Kampanya</button>
      </div>

      {message && (
        <div style={{
          marginBottom: '20px', padding: '14px 20px', borderRadius: '10px',
          background: message.type === 'success' ? '#064e3b' : '#450a0a',
          border: `1px solid ${message.type === 'success' ? '#065f46' : '#7f1d1d'}`,
          color: message.type === 'success' ? '#34d399' : '#f87171',
          fontSize: '14px', fontWeight: 600,
        }}>
          {message.text}
        </div>
      )}

      {/* ── Form ── */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f9fafb', marginBottom: '20px' }}>
            {editId ? 'Kampanyayı Düzenle' : 'Yeni Kampanya Ekle'}
          </h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Kampanya Adı + Durum */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <Field label="Kampanya Başlığı *">
                <Input value={form.title} onChange={f('title') as (v: string) => void} placeholder="Örn: Yaz Bakım Kampanyası" />
              </Field>
              <Field label="Yayın Durumu">
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  className="admin-input"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                </select>
              </Field>
            </div>

            {/* Açıklama */}
            <Field label="Açıklama">
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="admin-input"
                style={{ resize: 'vertical' }}
                placeholder="Kampanya detaylarını girin..."
              />
            </Field>

            {/* Görsel + Banner Rengi */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Kampanya Görseli">
                <MediaPicker
                  value={form.imageUrl}
                  onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
                  hint="Banner'da gösterilecek görsel"
                />
              </Field>
              <Field label="Banner Arka Plan Rengi">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={form.bannerColor}
                    onChange={(e) => setForm((p) => ({ ...p, bannerColor: e.target.value }))}
                    style={{ width: '48px', height: '40px', borderRadius: '6px', border: '1px solid #374151', cursor: 'pointer', padding: '2px' }}
                  />
                  <input
                    type="text"
                    value={form.bannerColor}
                    onChange={(e) => setForm((p) => ({ ...p, bannerColor: e.target.value }))}
                    className="admin-input"
                    placeholder="#202A34"
                    style={{ flex: 1 }}
                  />
                </div>
              </Field>
            </div>

            {/* Buton */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Buton Yazısı">
                <Input value={form.buttonText} onChange={f('buttonText') as (v: string) => void} placeholder="Örn: Kampanyayı İncele" />
              </Field>
              <Field label="Buton Bağlantısı">
                <Input value={form.buttonUrl} onChange={f('buttonUrl') as (v: string) => void} placeholder="/iletisim veya https://..." />
              </Field>
            </div>

            {/* Tarihler */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Başlangıç Tarihi">
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                  className="admin-input"
                />
              </Field>
              <Field label="Bitiş Tarihi">
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                  className="admin-input"
                />
              </Field>
            </div>

            {/* İlgili Hizmet + Reklam Sayfası */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="İlgili Hizmet">
                <select
                  value={form.relatedService}
                  onChange={(e) => setForm((p) => ({ ...p, relatedService: e.target.value }))}
                  className="admin-input"
                >
                  <option value="">— Hizmet seçin —</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Reklam Sayfası Bağlantısı">
                <Input value={form.landingPageUrl} onChange={f('landingPageUrl') as (v: string) => void} placeholder="/lp/yaz-bakimi" />
              </Field>
            </div>

            {/* Şartlar */}
            <Field label="Kampanya Şartları">
              <textarea
                value={form.terms}
                onChange={(e) => setForm((p) => ({ ...p, terms: e.target.value }))}
                rows={2}
                className="admin-input"
                style={{ resize: 'vertical' }}
                placeholder="* Kampanya 31 Ağustos'a kadar geçerlidir."
              />
            </Field>

            {/* Sıra + Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ width: '120px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#9ca3af', marginBottom: '6px' }}>Sıra</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))}
                  className="admin-input"
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#d1d5db', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  style={{ width: '16px', height: '16px', accentColor: '#dc2626' }}
                />
                Aktif
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#d1d5db', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={form.showOnHome}
                  onChange={(e) => setForm((p) => ({ ...p, showOnHome: e.target.checked }))}
                  style={{ width: '16px', height: '16px', accentColor: '#dc2626' }}
                />
                Ana Sayfada Göster
              </label>
            </div>

            {/* Butonlar */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button type="submit" disabled={saving} className="admin-btn-primary">
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="admin-btn-secondary">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── List ── */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '32px' }}>Yükleniyor...</p>
        ) : items.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '32px' }}>Henüz kampanya yok.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Başlık', 'Durum', 'Ana Sayfa', 'Bitiş Tarihi', 'İşlemler'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px 16px', color: '#f9fafb', fontSize: '14px', fontWeight: 500 }}>
                    {item.title}
                    {item.badge && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#f59e0b' }}>[{item.badge}]</span>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-flex', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                      background: item.status === 'published' ? 'rgba(22,163,74,0.15)' : 'rgba(107,114,128,0.15)',
                      color: item.status === 'published' ? '#4ade80' : '#9ca3af',
                    }}>
                      {item.status === 'published' ? 'Yayında' : 'Taslak'}
                    </span>
                    {!item.isActive && (
                      <span style={{ marginLeft: '6px', fontSize: '11px', color: '#f87171' }}>Pasif</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {item.showOnHome ? (
                      <span style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 600 }}>✓ Gösteriliyor</span>
                    ) : (
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '13px' }}>
                    {item.endDate ? new Date(item.endDate).toLocaleDateString('tr-TR') : 'Süresiz'}
                  </td>
                  <td style={{ padding: '14px 16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => startEdit(item)} style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      style={{ background: 'rgba(220,38,38,0.15)', color: '#f87171', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', fontWeight: 600, opacity: deleting === item.id ? 0.5 : 1 }}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
