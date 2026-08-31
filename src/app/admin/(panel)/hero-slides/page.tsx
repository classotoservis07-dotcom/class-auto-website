'use client';
import { useState, useEffect } from 'react';
import MediaPicker from '@/components/admin/MediaPicker';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  bgImage: string | null;
  overlayOpacity: number;
  btn1Text: string;
  btn1Url: string;
  btn2Text: string;
  btn2Url: string;
  badgeText: string | null;
  isActive: boolean;
  sortOrder: number;
}

const emptyForm = {
  title: '',
  subtitle: '',
  bgImage: '',
  overlayOpacity: 55,
  btn1Text: "WhatsApp'tan Randevu Al",
  btn1Url: '/iletisim',
  btn2Text: 'Hizmetlerimiz',
  btn2Url: '/hizmetler',
  badgeText: '',
  isActive: true,
  sortOrder: 0,
};

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/hero-slides');
      const data = await res.json();
      setSlides(data.slides ?? []);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const startEdit = (slide: Slide) => {
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      bgImage: slide.bgImage || '',
      overlayOpacity: slide.overlayOpacity,
      btn1Text: slide.btn1Text,
      btn1Url: slide.btn1Url,
      btn2Text: slide.btn2Text,
      btn2Url: slide.btn2Url,
      badgeText: slide.badgeText || '',
      isActive: slide.isActive,
      sortOrder: slide.sortOrder,
    });
    setEditId(slide.id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editId ? { id: editId, ...form } : form),
      });
      const data = await res.json();
      if (data.success) { showMsg('success', 'Kaydedildi.'); setShowForm(false); load(); }
      else showMsg('error', data.error ?? 'Hata oluştu.');
    } catch { showMsg('error', 'Bağlantı hatası.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu slaytı silmek istediğinizden emin misiniz?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/hero-slides?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { showMsg('success', 'Silindi.'); load(); }
      else showMsg('error', data.error ?? 'Silinemedi.');
    } catch { showMsg('error', 'Bağlantı hatası.'); }
    finally { setDeleting(null); }
  };

  const f = <K extends keyof typeof emptyForm>(key: K) => (val: (typeof emptyForm)[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f9fafb' }}>Hero Slaytları</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            Ana sayfa hero slider içeriklerini yönetin. Slayt yoksa varsayılan 3 slayt gösterilir.
          </p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }} className="admin-btn-primary">
          + Yeni Slayt
        </button>
      </div>

      {message && (
        <div style={{
          marginBottom: '20px', padding: '12px 20px', borderRadius: '10px',
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
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f9fafb', marginBottom: '20px' }}>
            {editId ? 'Slaytı Düzenle' : 'Yeni Slayt Ekle'}
          </h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Title */}
            <div>
              <label className="admin-label">Başlık *</label>
              <input
                type="text" className="admin-input" required
                value={form.title} onChange={(e) => f('title')(e.target.value)}
                placeholder="Ör: Antalya'da Profesyonel Oto Servis"
              />
              <p style={{ color: '#4b5563', fontSize: '11px', marginTop: '4px' }}>
                "Profesyonel", "Güvenilir", "Oto Servis", "Kaporta", "Boya", "Arıza Tespit" kelimeleri otomatik kırmızı renk alır.
              </p>
            </div>

            {/* Subtitle */}
            <div>
              <label className="admin-label">Alt Yazı *</label>
              <textarea
                className="admin-input" required rows={3} style={{ resize: 'vertical' }}
                value={form.subtitle} onChange={(e) => f('subtitle')(e.target.value)}
                placeholder="Kısa açıklama metni..."
              />
            </div>

            {/* BG Image + Overlay */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '16px', alignItems: 'start' }}>
              <div>
                <label className="admin-label">Arka Plan Görseli</label>
                <MediaPicker
                  value={form.bgImage}
                  onChange={(url) => f('bgImage')(url)}
                  hint="Boş bırakırsanız koyu antrasit gradyan kullanılır."
                />
              </div>
              <div>
                <label className="admin-label">Karartma Oranı: %{form.overlayOpacity}</label>
                <input
                  type="range" min="0" max="90" step="5"
                  value={form.overlayOpacity}
                  onChange={(e) => f('overlayOpacity')(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '8px' }}
                />
                <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '4px' }}>Görsel üstündeki siyah karartma</p>
              </div>
            </div>

            {/* Badge */}
            <div>
              <label className="admin-label">Üst Rozet Metni</label>
              <input
                type="text" className="admin-input"
                value={form.badgeText} onChange={(e) => f('badgeText')(e.target.value)}
                placeholder="Ör: Antalya Muratpaşa — Güzeloba"
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="admin-label">1. Buton Yazısı</label>
                <input type="text" className="admin-input" value={form.btn1Text} onChange={(e) => f('btn1Text')(e.target.value)} />
              </div>
              <div>
                <label className="admin-label">1. Buton URL</label>
                <input type="text" className="admin-input" value={form.btn1Url} onChange={(e) => f('btn1Url')(e.target.value)} placeholder="/iletisim veya https://wa.me/..." />
              </div>
              <div>
                <label className="admin-label">2. Buton Yazısı</label>
                <input type="text" className="admin-input" value={form.btn2Text} onChange={(e) => f('btn2Text')(e.target.value)} />
              </div>
              <div>
                <label className="admin-label">2. Buton URL</label>
                <input type="text" className="admin-input" value={form.btn2Url} onChange={(e) => f('btn2Url')(e.target.value)} placeholder="/hizmetler" />
              </div>
            </div>

            {/* Sıra + Aktif */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{ width: '120px' }}>
                <label className="admin-label">Sıra</label>
                <input type="number" className="admin-input" value={form.sortOrder} onChange={(e) => f('sortOrder')(Number(e.target.value))} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#d1d5db', fontSize: '14px', marginTop: '20px' }}>
                <input
                  type="checkbox" checked={form.isActive}
                  onChange={(e) => f('isActive')(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#dc2626' }}
                />
                Aktif (yayında)
              </label>
            </div>

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
        ) : slides.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', marginBottom: '8px' }}>Henüz slayt eklenmemiş.</p>
            <p style={{ color: '#4b5563', fontSize: '13px' }}>Slayt yokken ana sayfada 3 adet varsayılan slayt gösterilir.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Sıra', 'Başlık', 'Görsel', 'Durum', 'İşlemler'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) => (
                <tr key={slide.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '14px' }}>{slide.sortOrder}</td>
                  <td style={{ padding: '14px 16px', color: '#f9fafb', fontSize: '14px', fontWeight: 500, maxWidth: '300px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slide.title}</div>
                    {slide.badgeText && <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '3px' }}>{slide.badgeText}</div>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {slide.bgImage ? (
                      <span style={{ fontSize: '12px', color: '#60a5fa' }}>✓ Görsel var</span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Gradyan</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-flex', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                      background: slide.isActive ? 'rgba(22,163,74,0.15)' : 'rgba(107,114,128,0.15)',
                      color: slide.isActive ? '#4ade80' : '#9ca3af',
                    }}>
                      {slide.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => startEdit(slide)}
                        style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        disabled={deleting === slide.id}
                        style={{ background: 'rgba(220,38,38,0.15)', color: '#f87171', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', fontWeight: 600, opacity: deleting === slide.id ? 0.5 : 1 }}
                      >
                        Sil
                      </button>
                    </div>
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
