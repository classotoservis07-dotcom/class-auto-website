'use client';
import { useState, useEffect } from 'react';

const defaultForm = {
  'seo.siteTitle': '',
  'seo.siteDescription': '',
  'seo.keywords': '',
  'seo.googleVerification': '',
  'seo.ogImage': '',
  'seo.canonicalBase': ''
};

export default function SeoAyarlariPage() {
  const [form, setForm] = useState<Record<string, string>>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error'; text: string} | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.settings) {
          const newForm: Record<string, string> = { ...defaultForm };
          data.settings.forEach((s: { key: string; value: string }) => {
            if (Object.prototype.hasOwnProperty.call(newForm, s.key)) {
              newForm[s.key] = s.value;
            }
          });
          setForm(newForm);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const showMsg = (type: 'success'|'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Settings API expects { updates: { [key]: value } }
      const updates: Record<string, string> = {};
      Object.keys(form).forEach((key) => { updates[key] = form[key]; });

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg('success', 'SEO ayarları kaydedildi.');
      } else {
        showMsg('error', data.error || 'Kaydedilemedi.');
      }
    } catch {
      showMsg('error', 'Bağlantı hatası.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">SEO Ayarları</h1>

      {message && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 rounded shadow border border-gray-200">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Başlığı (Title)</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                value={form['seo.siteTitle']}
                onChange={e => setForm({...form, 'seo.siteTitle': e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">Arama sonuçlarında görünen ana başlık.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Canonical Bâz Adresi</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.ornek.com"
                value={form['seo.canonicalBase']}
                onChange={e => setForm({...form, 'seo.canonicalBase': e.target.value})}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Açıklaması (Meta Description)</label>
              <textarea 
                className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={form['seo.siteDescription']}
                onChange={e => setForm({...form, 'seo.siteDescription': e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">Arama sonuçlarında başlığın altında görünen kısa açıklama (150-160 karakter önerilir).</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Anahtar Kelimeler (Keywords)</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="oto servis, tamir, bakım, istanbul"
                value={form['seo.keywords']}
                onChange={e => setForm({...form, 'seo.keywords': e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Search Console Kodu</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                value={form['seo.googleVerification']}
                onChange={e => setForm({...form, 'seo.googleVerification': e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Open Graph (Sosyal Medya) Görseli URL</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="/uploads/og-image.jpg"
                value={form['seo.ogImage']}
                onChange={e => setForm({...form, 'seo.ogImage': e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">WhatsApp veya Facebook'ta site paylaşıldığında çıkacak görselin yolu.</p>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
