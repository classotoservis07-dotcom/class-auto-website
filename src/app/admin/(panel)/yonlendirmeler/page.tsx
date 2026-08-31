'use client';
import { useState, useEffect } from 'react';

type Item = { 
  id: number; 
  from: string;
  to: string;
  type: number;
  isActive: boolean;
  hits: number;
};

const emptyForm = { 
  from: '',
  to: '',
  type: 301,
  isActive: true
};

export default function YonlendirmelerPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error'; text: string} | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/yonlendirmeler');
      const data = await res.json();
      setItems(data.redirects ?? []);
    } catch { 
      /* ignore */ 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { load(); }, []);

  const showMsg = (type: 'success'|'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const startEdit = (item: Item) => {
    setForm({ 
      from: item.from,
      to: item.to,
      type: item.type,
      isActive: item.isActive
    });
    setEditId(item.id);
    setShowForm(true);
  };

  const startNew = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/admin/yonlendirmeler', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(editId ? { id: editId, ...form } : form)
      });
      const data = await res.json();
      if (data.success) { 
        showMsg('success', 'Kaydedildi.'); 
        setShowForm(false); 
        load(); 
      }
      else showMsg('error', data.error ?? 'Hata oluştu.');
    } catch { 
      showMsg('error', 'Bağlantı hatası.'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/yonlendirmeler?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { 
        showMsg('success', 'Silindi.'); 
        load(); 
      }
      else showMsg('error', data.error ?? 'Silinemedi.');
    } catch { 
      showMsg('error', 'Bağlantı hatası.'); 
    } finally { 
      setDeleting(null); 
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">URL Yönlendirmeleri</h1>
        <button 
          onClick={startNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Yeni Ekle
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">{editId ? 'Düzenle' : 'Yeni Ekle'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kaynak URL (From)</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  placeholder="/eski-sayfa"
                  value={form.from}
                  onChange={e => setForm({...form, from: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hedef URL (To)</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  placeholder="/yeni-sayfa"
                  value={form.to}
                  onChange={e => setForm({...form, to: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yönlendirme Tipi</label>
                <select 
                  className="w-full border p-2 rounded"
                  value={form.type}
                  onChange={e => setForm({...form, type: Number(e.target.value)})}
                >
                  <option value={301}>301 (Kalıcı - SEO için önerilir)</option>
                  <option value={302}>302 (Geçici)</option>
                </select>
              </div>
              <div className="flex items-center mt-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={form.isActive}
                    onChange={e => setForm({...form, isActive: e.target.checked})}
                  />
                  <span>Aktif</span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Yükleniyor...</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Henüz yönlendirme yok.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kaynak (From)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hedef (To)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.from}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.to}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-gray-100 text-gray-800">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.hits}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.isActive ? 
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aktif</span> : 
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Pasif</span>
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => startEdit(item)} 
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Düzenle
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      disabled={deleting === item.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
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
