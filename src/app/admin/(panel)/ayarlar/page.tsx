'use client';

import { useState, useEffect } from 'react';
import MediaPicker from '@/components/admin/MediaPicker';

type Setting = { key: string; value: string; label: string; type: string; group: string };

type Tab = 'general' | 'contact' | 'logo' | 'seo' | 'social' | 'harita' | 'analytics';

const TAB_LABELS: Record<Tab, string> = {
  general: 'Genel',
  contact: 'İletişim',
  logo: 'Logo ve Marka',
  seo: 'SEO',
  social: 'Sosyal Medya',
  harita: 'Harita',
  analytics: 'Analitik',
};

// Harita sekmesi için statik alanlar
const MAP_FIELDS = [
  { key: 'map_embed_url',      label: 'Google Maps Embed URL',    type: 'textarea', hint: 'Google Maps "Haritayı Paylaş > Haritayı Göm" kısmından kopyalayın. Sadece src="..." kısmını yapıştırın.' },
  { key: 'map_directions_url', label: 'Yol Tarifi Bağlantısı',   type: 'url',      hint: 'Google Maps yol tarifi URL\'si (https://maps.google.com/...)' },
  { key: 'map_title',          label: 'Harita Başlığı',           type: 'text',     hint: 'Harita iframe başlığı (erişilebilirlik için)' },
  { key: 'map_active',         label: 'Harita Aktif',             type: 'boolean',  hint: 'Haritayı göster/gizle' },
];

// Analytics sekmesi için statik alanlar
const ANALYTICS_FIELDS = [
  { key: 'gtm_id',                   label: 'Google Tag Manager ID',       type: 'text', hint: 'Örnek: GTM-XXXXXXX' },
  { key: 'ga4_id',                   label: 'Google Analytics 4 ID',       type: 'text', hint: 'Örnek: G-XXXXXXXXXX' },
  { key: 'google_ads_conversion_id', label: 'Google Ads Conversion ID',    type: 'text', hint: 'Örnek: AW-XXXXXXXXX' },
];


const LOGO_FIELDS = [
  { key: 'logo.main',    label: 'Ana Logo',              hint: 'Koyu zeminde kullanılır. PNG/SVG (şeffaf arka plan). Önerilen: 400×120px' },
  { key: 'logo.light',   label: 'Açık Zemin Logosu',     hint: 'Beyaz/açık arka planda kullanılır. PNG/SVG. Önerilen: 400×120px' },
  { key: 'logo.mobile',  label: 'Mobil Logo',             hint: 'Küçük ekranlarda kullanılır. Kare veya simge. Önerilen: 120×120px' },
  { key: 'logo.favicon', label: 'Favicon',                hint: 'Tarayıcı sekmesinde görünür. ICO veya 32×32 PNG.' },
  { key: 'logo.footer',  label: 'Footer Logosu',          hint: 'Site alt alanında kullanılır. Genellikle beyaz/açık renk.' },
  { key: 'logo.og',      label: 'Sosyal Paylaşım Görseli',hint: 'Facebook, Twitter vb. paylaşımlarda görünür. Önerilen: 1200×630px, JPG/PNG.' },
];

export default function SiteSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings ?? []);
        setValues(data.map ?? {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const filtered: Record<string, string> = {};

      if (activeTab === 'logo') {
        // Logo sekmesinde LOGO_FIELDS'i kaydet
        LOGO_FIELDS.forEach(({ key }) => {
          filtered[key] = values[key] ?? '';
        });
      } else if (activeTab === 'harita') {
        MAP_FIELDS.forEach(({ key }) => {
          filtered[key] = values[key] ?? '';
        });
      } else if (activeTab === 'analytics') {
        ANALYTICS_FIELDS.forEach(({ key }) => {
          filtered[key] = values[key] ?? '';
        });
      } else {
        settings
          .filter((s) => s.group === activeTab)
          .forEach((s) => { filtered[s.key] = values[s.key] ?? ''; });
      }

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: filtered }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: '✓ Ayarlar başarıyla kaydedildi.' });
      } else {
        setMessage({ type: 'error', text: data.error ?? 'Kayıt başarısız.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Bağlantı hatası. Lütfen tekrar deneyin.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };


  const tabSettings = settings.filter((s) => s.group === activeTab);

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f9fafb' }}>Site Ayarları</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Sitenin tüm ayarlarını buradan yönetin.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="admin-btn-primary">
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
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

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Tab'lar */}
        <div style={{ width: '180px', flexShrink: 0 }}>
          {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 16px', borderRadius: '8px', border: 'none',
                background: activeTab === tab ? '#dc2626' : 'transparent',
                color: activeTab === tab ? 'white' : '#9ca3af',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                marginBottom: '4px', transition: 'all 0.15s',
              }}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Form Alanları */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div className="admin-card">
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '32px' }}>Yükleniyor...</p>
            </div>
          ) : activeTab === 'logo' ? (
            /* ── Logo Sekmesi: Her logo için MediaPicker ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="admin-card">
                <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>
                  Her logo türü için bilgisayarınızdan görsel yükleyebilir veya Medya Kütüphanesi'nden seçim yapabilirsiniz.
                  Görsel yüklendikten sonra <strong style={{ color: '#f9fafb' }}>Değişiklikleri Kaydet</strong> butonuna basın.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  {LOGO_FIELDS.map(({ key, label, hint }) => (
                    <MediaPicker
                      key={key}
                      label={label}
                      value={values[key] ?? ''}
                      onChange={(url) => setValues((v) => ({ ...v, [key]: url }))}
                      hint={hint}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'harita' || activeTab === 'analytics' ? (
            /* ── Harita / Analytics: statik alan listesi ── */
            <div className="admin-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {(activeTab === 'harita' ? MAP_FIELDS : ANALYTICS_FIELDS).map((field) => (
                  <div key={field.key}>
                    <label className="admin-label">{field.label}</label>

                    {field.type === 'textarea' ? (
                      <textarea
                        value={values[field.key] ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                        rows={4}
                        className="admin-input"
                        style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }}
                        placeholder={field.label}
                      />
                    ) : field.type === 'boolean' ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={values[field.key] !== 'false'}
                          onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.checked ? 'true' : 'false' }))}
                          style={{ width: '18px', height: '18px', accentColor: '#dc2626' }}
                        />
                        <span style={{ color: '#d1d5db', fontSize: '14px' }}>Aktif</span>
                      </label>
                    ) : (
                      <input
                        type={field.type}
                        value={values[field.key] ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                        className="admin-input"
                        placeholder={field.label}
                      />
                    )}

                    {field.hint && (
                      <p style={{ color: '#4b5563', fontSize: '11px', marginTop: '4px' }}>{field.hint}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="admin-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {tabSettings.map((setting) => (
                  <div key={setting.key}>
                    <label className="admin-label">{setting.label}</label>

                    {setting.type === 'textarea' ? (
                      <textarea
                        value={values[setting.key] ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, [setting.key]: e.target.value }))}
                        rows={3}
                        className="admin-input"
                        style={{ resize: 'vertical' }}
                      />
                    ) : setting.type === 'image' ? (
                      <MediaPicker
                        value={values[setting.key] ?? ''}
                        onChange={(url) => setValues((v) => ({ ...v, [setting.key]: url }))}
                      />
                    ) : setting.type === 'boolean' ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={values[setting.key] === 'true'}
                          onChange={(e) => setValues((v) => ({ ...v, [setting.key]: e.target.checked ? 'true' : 'false' }))}
                          style={{ width: '18px', height: '18px', accentColor: '#dc2626' }}
                        />
                        <span style={{ color: '#d1d5db', fontSize: '14px' }}>Aktif</span>
                      </label>
                    ) : (
                      <input
                        type={setting.key.includes('email') ? 'email' : setting.key.includes('url') || setting.key.includes('_url') ? 'url' : 'text'}
                        value={values[setting.key] ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, [setting.key]: e.target.value }))}
                        className="admin-input"
                        placeholder={setting.label}
                      />
                    )}

                    <p style={{ color: '#4b5563', fontSize: '11px', marginTop: '4px' }}>
                      Anahtar: <code style={{ fontFamily: 'monospace' }}>{setting.key}</code>
                    </p>
                  </div>
                ))}

                {tabSettings.length === 0 && (
                  <p style={{ color: '#6b7280', textAlign: 'center', padding: '24px 0' }}>Bu sekme için ayar bulunamadı.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
