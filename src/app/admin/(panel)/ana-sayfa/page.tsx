'use client';

import { useState, useEffect } from 'react';
import MediaPicker from '@/components/admin/MediaPicker';

type HeroData = {
  id?: number;
  title: string;
  subtitle: string;
  desktopImage: string;
  mobileImage: string;
  overlayOpacity: number;
  height: string;
  textAlign: string;
  btn1Text: string;
  btn1Url: string;
  btn2Text: string;
  btn2Url: string;
  btn3Text: string;
  btn3Url: string;
  trustBadges: string;
  isActive: boolean;
};

const defaultHero: HeroData = {
  title: 'Aracınız İçin Güvenilir ve Profesyonel Servis',
  subtitle: 'Mekanikten kaporta ve boyaya, arıza tespitinden lastik hizmetlerine kadar aracınızın tüm ihtiyaçları CLASS AUTO güvencesiyle tek noktada.',
  desktopImage: '',
  mobileImage: '',
  overlayOpacity: 60,
  height: '90vh',
  textAlign: 'left',
  btn1Text: "WhatsApp'tan Randevu Al",
  btn1Url: '#',
  btn2Text: 'Hemen Ara',
  btn2Url: '#',
  btn3Text: 'Hizmetleri İncele',
  btn3Url: '/hizmetler',
  trustBadges: JSON.stringify(['Uzman Ekip', 'Şeffaf Bilgilendirme', 'Tüm Markalara Hizmet', 'Kaliteli İşçilik']),
  isActive: true,
};

export default function AnaSayfaYonetimPage() {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [badgeInput, setBadgeInput] = useState('');
  const [badges, setBadges] = useState<string[]>(['Uzman Ekip', 'Şeffaf Bilgilendirme', 'Tüm Markalara Hizmet', 'Kaliteli İşçilik']);

  useEffect(() => {
    fetch('/api/admin/hero')
      .then((r) => r.json())
      .then((data) => {
        if (data.hero) {
          setHero({
            ...defaultHero,
            ...data.hero,
            desktopImage: data.hero.desktopImage ?? '',
            mobileImage: data.hero.mobileImage ?? '',
            btn1Text: data.hero.btn1Text ?? defaultHero.btn1Text,
            btn1Url: data.hero.btn1Url ?? '#',
            btn2Text: data.hero.btn2Text ?? defaultHero.btn2Text,
            btn2Url: data.hero.btn2Url ?? '#',
            btn3Text: data.hero.btn3Text ?? defaultHero.btn3Text,
            btn3Url: data.hero.btn3Url ?? '/hizmetler',
            trustBadges: data.hero.trustBadges ?? '[]',
          });
          try { setBadges(JSON.parse(data.hero.trustBadges || '[]')); } catch {}
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...hero, trustBadges: JSON.stringify(badges) }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: '✓ Hero bölümü kaydedildi.' });
      } else {
        setMessage({ type: 'error', text: data.error ?? 'Kayıt başarısız.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Bağlantı hatası.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const set = (key: keyof HeroData, value: string | number | boolean) =>
    setHero((h) => ({ ...h, [key]: value }));

  const addBadge = () => {
    if (badgeInput.trim()) {
      setBadges((b) => [...b, badgeInput.trim()]);
      setBadgeInput('');
    }
  };

  const removeBadge = (i: number) => setBadges((b) => b.filter((_, idx) => idx !== i));

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f9fafb' }}>Ana Sayfa — Hero Bölümü</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Ana sayfanın ilk ekranını buradan yönetin.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="/" target="_blank" className="admin-btn-secondary">Önizleme</a>
          <button onClick={handleSave} disabled={saving} className="admin-btn-primary">
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Sol Kolon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Aktif/Pasif */}
          <div className="admin-card">
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={hero.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#dc2626' }}
              />
              <div>
                <p style={{ color: '#f9fafb', fontWeight: 600, fontSize: '14px' }}>Hero Bölümü Aktif</p>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>Kapatıldığında hero bölümü gizlenir.</p>
              </div>
            </label>
          </div>

          {/* Metinler */}
          <div className="admin-card">
            <h2 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>Metinler</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="admin-label">Ana Başlık</label>
                <input type="text" className="admin-input" value={hero.title} onChange={(e) => set('title', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Alt Metin</label>
                <textarea className="admin-input" rows={3} value={hero.subtitle} onChange={(e) => set('subtitle', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="admin-label">Metin Hizalama</label>
                <select className="admin-input" value={hero.textAlign} onChange={(e) => set('textAlign', e.target.value)}>
                  <option value="left">Sola Hizalı</option>
                  <option value="center">Ortalanmış</option>
                  <option value="right">Sağa Hizalı</option>
                </select>
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="admin-card">
            <h2 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>Butonlar</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { textKey: 'btn1Text' as keyof HeroData, urlKey: 'btn1Url' as keyof HeroData, label: 'WhatsApp Butonu', color: '#25D366' },
                { textKey: 'btn2Text' as keyof HeroData, urlKey: 'btn2Url' as keyof HeroData, label: 'Telefon Butonu', color: '#dc2626' },
                { textKey: 'btn3Text' as keyof HeroData, urlKey: 'btn3Url' as keyof HeroData, label: 'Hizmetler Butonu', color: '#6b7280' },
              ].map((btn) => (
                <div key={btn.label} style={{ padding: '12px', background: '#111827', borderRadius: '8px', border: '1px solid #374151' }}>
                  <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: btn.color, marginRight: '6px' }} />
                    {btn.label}
                  </p>
                  <input type="text" className="admin-input" value={String(hero[btn.textKey])} onChange={(e) => set(btn.textKey, e.target.value)} placeholder="Buton yazısı" style={{ marginBottom: '6px' }} />
                  <input type="text" className="admin-input" value={String(hero[btn.urlKey])} onChange={(e) => set(btn.urlKey, e.target.value)} placeholder="Bağlantı URL'si" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ Kolon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Görsel */}
          <div className="admin-card">
            <h2 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>Hero Görseli</h2>
            <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '14px' }}>Ağır slider veya video kullanmıyoruz. Tek, kaliteli, sıkıştırılmış görsel önerilir (WebP, maks. 300 KB).</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <MediaPicker value={hero.desktopImage} onChange={(url) => set('desktopImage', url)} hint="Önerilen: 1920×800px, WebP veya JPEG" />
              </div>
              <div style={{ marginTop: '10px' }}>
                <MediaPicker value={hero.mobileImage} onChange={(url) => set('mobileImage', url)} hint="Önerilen: 800×600px, WebP veya JPEG" />
              </div>
            </div>
          </div>

          {/* Görünüm Ayarları */}
          <div className="admin-card">
            <h2 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>Görünüm Ayarları</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="admin-label">Koyu Katman Yoğunluğu: %{hero.overlayOpacity}</label>
                <input type="range" min={0} max={95} value={hero.overlayOpacity} onChange={(e) => set('overlayOpacity', parseInt(e.target.value))} style={{ width: '100%', accentColor: '#dc2626' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '11px', marginTop: '4px' }}>
                  <span>Şeffaf</span><span>Koyu</span>
                </div>
              </div>
              <div>
                <label className="admin-label">Bölüm Yüksekliği</label>
                <select className="admin-input" value={hero.height} onChange={(e) => set('height', e.target.value)}>
                  <option value="70vh">Orta (%70)</option>
                  <option value="80vh">Büyük (%80)</option>
                  <option value="90vh">Tam Ekran (%90)</option>
                  <option value="100vh">Tam Yükseklik (%100)</option>
                  <option value="600px">Sabit 600px</option>
                </select>
              </div>
            </div>
          </div>

          {/* Güven Unsurları */}
          <div className="admin-card">
            <h2 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>Güven Unsurları</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="text"
                className="admin-input"
                value={badgeInput}
                onChange={(e) => setBadgeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addBadge()}
                placeholder="Güven unsuru metni"
                style={{ flex: 1 }}
              />
              <button onClick={addBadge} className="admin-btn-primary" style={{ whiteSpace: 'nowrap' }}>Ekle</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {badges.map((badge, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', background: '#111827', border: '1px solid #374151', borderRadius: '20px', fontSize: '13px', color: '#d1d5db' }}>
                  {badge}
                  <button onClick={() => removeBadge(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0', lineHeight: 1, fontSize: '16px' }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
