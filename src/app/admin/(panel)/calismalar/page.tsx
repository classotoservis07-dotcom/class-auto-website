'use client';

/**
 * Admin — Çalışmalar Galerisi
 * Fotoğraf yükleyip galeri çalışması oluşturma/düzenleme/silme.
 * MediaPicker entegreli.
 */

import { useState, useEffect, useRef } from 'react';
import MediaPicker from '@/components/admin/MediaPicker';

interface Work {
  id: number;
  title: string;
  shortDesc: string | null;
  coverImage: string | null;
  vehicleBrand: string | null;
  vehicleModel: string | null;
  vehicleYear: string | null;
  category: string | null;
  status: string;
  showOnHome: boolean;
  sortOrder: number;
}

const CATEGORIES = [
  { value: 'kaporta', label: 'Kaporta' },
  { value: 'boya', label: 'Boya' },
  { value: 'mekanik', label: 'Mekanik' },
  { value: 'elektrik', label: 'Oto Elektrik' },
  { value: 'lastik', label: 'Lastik' },
  { value: 'klima', label: 'Klima' },
  { value: 'genel', label: 'Genel Bakım' },
  { value: 'diger', label: 'Diğer' },
];

const emptyForm = {
  title: '',
  shortDesc: '',
  coverImage: '',
  vehicleBrand: '',
  vehicleModel: '',
  vehicleYear: '',
  category: 'kaporta',
  status: 'published',
  showOnHome: true,
  sortOrder: 0,
};

export default function CalismanlarAdminPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/calismalar');
      const data = await res.json();
      setWorks(data.works ?? []);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const openNew = () => {
    setForm({ ...emptyForm });
    setEditId(null);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const openEdit = (w: Work) => {
    setForm({
      title: w.title,
      shortDesc: w.shortDesc ?? '',
      coverImage: w.coverImage ?? '',
      vehicleBrand: w.vehicleBrand ?? '',
      vehicleModel: w.vehicleModel ?? '',
      vehicleYear: w.vehicleYear ?? '',
      category: w.category ?? 'diger',
      status: w.status,
      showOnHome: w.showOnHome,
      sortOrder: w.sortOrder,
    });
    setEditId(w.id);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const cancel = () => { setShowForm(false); setEditId(null); setForm({ ...emptyForm }); };

  const save = async () => {
    if (!form.title.trim()) { showMsg('error', 'Başlık zorunludur.'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/calismalar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showMsg('success', editId ? 'Çalışma güncellendi!' : 'Çalışma eklendi!');
      cancel();
      load();
    } catch (e: unknown) {
      showMsg('error', e instanceof Error ? e.message : 'Kayıt hatası');
    } finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm('Bu çalışmayı silmek istediğinizden emin misiniz?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/calismalar?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error('Silme hatası');
      showMsg('success', 'Çalışma silindi.');
      load();
    } catch { showMsg('error', 'Silme başarısız.'); }
    finally { setDeleting(null); }
  };

  const toggleStatus = async (w: Work) => {
    const newStatus = w.status === 'published' ? 'draft' : 'published';
    try {
      await fetch('/api/admin/calismalar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: w.id, title: w.title, status: newStatus }),
      });
      load();
    } catch { /* ignore */ }
  };

  const inp = (field: string, value: string | boolean | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <div style={{ padding: '32px', maxWidth: '1200px' }}>
      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f9fafb' }}>Çalışmalar Galerisi</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            {works.length} çalışma
            &nbsp;•&nbsp;
            <a href="/calismalarimiz" target="_blank" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Siteyi Görüntüle ↗
            </a>
          </p>
        </div>
        <button onClick={openNew} className="admin-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Yeni Çalışma Ekle
        </button>
      </div>

      {/* Mesaj */}
      {msg && (
        <div style={{
          marginBottom: '16px', padding: '12px 16px', borderRadius: '10px',
          background: msg.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${msg.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: msg.type === 'success' ? '#86efac' : '#fca5a5', fontSize: '14px',
        }}>
          {msg.text}
        </div>
      )}

      {/* Gizlilik uyarısı */}
      <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '10px', fontSize: '13px', color: '#fbbf24' }}>
        ⚠️ Fotoğraflarda plaka, müşteri adı veya kişisel bilgi bulunmamasına dikkat edin.
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div ref={formRef} className="admin-card" style={{ marginBottom: '28px', padding: '28px' }}>
          <h2 style={{ color: '#f9fafb', fontWeight: 700, fontSize: '17px', marginBottom: '20px' }}>
            {editId ? 'Çalışmayı Düzenle' : 'Yeni Çalışma Ekle'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Başlık */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Başlık *</label>
              <input
                className="admin-input"
                placeholder="ör. Ön Tampon Kaporta Tamiri"
                value={form.title}
                onChange={(e) => inp('title', e.target.value)}
              />
            </div>

            {/* Açıklama */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Kısa Açıklama</label>
              <textarea
                className="admin-input"
                rows={3}
                placeholder="Çalışma hakkında kısa bilgi..."
                value={form.shortDesc}
                onChange={(e) => inp('shortDesc', e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Kapak Görseli */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="admin-label">Fotoğraf</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Önizleme */}
                {form.coverImage && (
                  <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #374151', flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.coverImage} alt="önizleme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => inp('coverImage', '')}
                      style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', color: '#fff', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      aria-label="Görseli kaldır"
                    >×</button>
                  </div>
                )}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <button
                    className="admin-btn-secondary"
                    style={{ marginBottom: '8px', width: '100%' }}
                    onClick={() => setShowMediaPicker(true)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    {form.coverImage ? 'Görseli Değiştir' : 'Galeriden Seç veya Yükle'}
                  </button>
                  <input
                    className="admin-input"
                    placeholder="veya görsel URL yapıştır"
                    value={form.coverImage}
                    onChange={(e) => inp('coverImage', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* MediaPicker Modal */}
            {showMediaPicker && (
              <div style={{ gridColumn: '1 / -1' }}>
                <MediaPicker
                  value={form.coverImage}
                  onChange={(url) => { inp('coverImage', url); setShowMediaPicker(false); }}
                  label="Fotoğraf seç"
                />
                <button
                  onClick={() => setShowMediaPicker(false)}
                  className="admin-btn-secondary"
                  style={{ marginTop: '8px', fontSize: '13px' }}
                >Kapat</button>
              </div>
            )}

            {/* Araç Bilgileri */}
            <div>
              <label className="admin-label">Araç Markası</label>
              <input className="admin-input" placeholder="ör. BMW, Toyota" value={form.vehicleBrand} onChange={(e) => inp('vehicleBrand', e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Araç Modeli</label>
              <input className="admin-input" placeholder="ör. 3 Serisi, Corolla" value={form.vehicleModel} onChange={(e) => inp('vehicleModel', e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Model Yılı</label>
              <input className="admin-input" placeholder="ör. 2019" value={form.vehicleYear} onChange={(e) => inp('vehicleYear', e.target.value)} />
            </div>

            {/* Kategori */}
            <div>
              <label className="admin-label">Kategori</label>
              <select className="admin-input" value={form.category} onChange={(e) => inp('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            {/* Sıra */}
            <div>
              <label className="admin-label">Sıralama</label>
              <input type="number" className="admin-input" value={form.sortOrder} onChange={(e) => inp('sortOrder', parseInt(e.target.value) || 0)} />
            </div>

            {/* Durum + Ana sayfa */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d5db', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.status === 'published'} onChange={(e) => inp('status', e.target.checked ? 'published' : 'draft')} style={{ accentColor: '#E30613' }} />
                Yayında
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d5db', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.showOnHome} onChange={(e) => inp('showOnHome', e.target.checked)} style={{ accentColor: '#E30613' }} />
                Ana Sayfada Göster
              </label>
            </div>
          </div>

          {/* Kaydet / İptal */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={save} disabled={saving} className="admin-btn-primary">
              {saving ? 'Kaydediliyor...' : (editId ? 'Güncelle' : 'Kaydet')}
            </button>
            <button onClick={cancel} className="admin-btn-secondary">İptal</button>
          </div>
        </div>
      )}

      {/* ── Galeri Grid ── */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '48px' }}>Yükleniyor...</div>
      ) : works.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
          <h2 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>Henüz çalışma eklenmemiş</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Gerçek müşteri araçlarından fotoğraflar ekleyerek galeri oluşturun.</p>
          <button onClick={openNew} className="admin-btn-primary">İlk Çalışmayı Ekle</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {works.map((work) => (
            <div key={work.id} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Görsel */}
              <div style={{ height: '175px', background: '#111827', position: 'relative', overflow: 'hidden' }}>
                {work.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={work.coverImage} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '6px' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" aria-hidden="true">
                      <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <p style={{ color: '#374151', fontSize: '11px' }}>Fotoğraf yok</p>
                  </div>
                )}
                {/* Badges */}
                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span
                    onClick={() => toggleStatus(work)}
                    title="Durumu değiştirmek için tıkla"
                    style={{
                      cursor: 'pointer',
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em',
                      padding: '3px 8px', borderRadius: '999px',
                      background: work.status === 'published' ? 'rgba(34,197,94,0.9)' : 'rgba(251,191,36,0.9)',
                      color: '#fff',
                    }}
                  >
                    {work.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                  {work.showOnHome && (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '999px', background: 'rgba(59,130,246,0.9)', color: '#fff' }}>
                      Ana Sayfa
                    </span>
                  )}
                </div>
                {/* Kategori */}
                {work.category && (
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '999px', background: 'rgba(227,6,19,0.85)', color: '#fff' }}>
                      {CATEGORIES.find(c => c.value === work.category)?.label || work.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Bilgi */}
              <div style={{ padding: '14px 16px' }}>
                <h3 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {work.title}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '12px' }}>
                  {[work.vehicleBrand, work.vehicleModel, work.vehicleYear].filter(Boolean).join(' · ') || '—'}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEdit(work)} className="admin-btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '5px 10px', justifyContent: 'center' }}>
                    Düzenle
                  </button>
                  <button
                    onClick={() => del(work.id)}
                    disabled={deleting === work.id}
                    style={{
                      padding: '5px 10px', fontSize: '12px', borderRadius: '8px',
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                      color: '#f87171', cursor: 'pointer',
                    }}
                  >
                    {deleting === work.id ? '...' : 'Sil'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
