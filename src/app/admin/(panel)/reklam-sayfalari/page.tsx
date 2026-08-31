'use client';
import { useState, useEffect } from 'react';

type Item = { 
  id: number; 
  slug: string;
  title: string;
  headline: string;
  content: string | null;
  serviceType: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  isActive: boolean;
  heroImage: string | null;
};

const emptyForm = { 
  slug: '',
  title: '',
  headline: '',
  content: '',
  serviceType: '',
  metaTitle: '',
  metaDesc: '',
  isActive: true,
  heroImage: ''
};

export default function ReklamSayfalariPage() {
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
      const res = await fetch('/api/admin/reklam-sayfalari');
      const data = await res.json();
      setItems(data.pages ?? []);
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
      slug: item.slug,
      title: item.title,
      headline: item.headline,
      content: item.content || '',
      serviceType: item.serviceType || '',
      metaTitle: item.metaTitle || '',
      metaDesc: item.metaDesc || '',
      isActive: item.isActive,
      heroImage: item.heroImage || ''
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
      const res = await fetch('/api/admin/reklam-sayfalari', {
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
      const res = await fetch(`/api/admin/reklam-sayfalari?id=${id}`, { method: 'DELETE' });
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
        <h1 className="text-2xl font-bold">Reklam Sayfaları (Landing Pages)</h1>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık (Dahili)</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Yolu (Slug) - Boş bırakılabilir</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  value={form.slug}
                  onChange={e => setForm({...form, slug: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Manşet (Headline)</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  value={form.headline}
                  onChange={e => setForm({...form, headline: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                <textarea 
                  className="w-full border p-2 rounded"
                  rows={4}
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hizmet Tipi</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  value={form.serviceType}
                  onChange={e => setForm({...form, serviceType: e.target.value})}
                />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  value={form.metaTitle}
                  onChange={e => setForm({...form, metaTitle: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  value={form.metaDesc}
                  onChange={e => setForm({...form, metaDesc: e.target.value})}
                />
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
          <div className="p-4 text-center text-gray-500">Henüz reklam sayfası yok.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hizmet Tipi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/{item.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.serviceType || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.isActive ? 
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aktif</span> : 
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Pasif</span>
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={`/${item.slug}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900 mr-4">Görüntüle</a>
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
