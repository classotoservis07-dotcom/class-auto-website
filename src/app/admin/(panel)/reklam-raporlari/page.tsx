'use client';
import { useState, useEffect } from 'react';

export default function ReklamRaporlariPage() {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error'; text: string} | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.settings) {
          const notesSetting = data.settings.find((s: any) => s.key === 'ads.manualNotes');
          if (notesSetting) setNotes(notesSetting.value);
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
      const payload = {
        'ads.manualNotes': { value: notes, group: 'general', type: 'textarea' }
      };

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ settings: payload })
      });
      const data = await res.json();
      if (data.success) {
        showMsg('success', 'Notlar kaydedildi.');
      } else {
        showMsg('error', data.error || 'Kaydedilemedi.');
      }
    } catch {
      showMsg('error', 'Bağlantı hatası.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Reklam Raporları</h1>
      <p className="text-gray-600 mb-6">
        Google Ads ve Meta entegrasyonu yakında eklenecek. Şu an reklam performans notlarınızı aşağıya girebilirsiniz.
      </p>

      {message && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Placeholder Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Toplam Gösterim (Örnek)</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Toplam Tıklama (Örnek)</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-yellow-500">
          <div className="text-sm text-gray-500">Maliyet (Örnek)</div>
          <div className="text-2xl font-bold">₺0.00</div>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
          <div className="text-sm text-gray-500">Dönüşüm (Örnek)</div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Manuel Reklam Notları</h2>
        {loading ? (
          <div>Yükleniyor...</div>
        ) : (
          <form onSubmit={handleSave}>
            <textarea 
              className="w-full border p-4 rounded focus:ring-blue-500 focus:border-blue-500"
              rows={10}
              placeholder="Örn: Ekim ayında Google Search kampanyası günlük 150₺ bütçeyle çalıştı. Getiri: 12 form doldurma."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {saving ? 'Kaydediliyor...' : 'Notları Kaydet'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
