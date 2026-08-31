'use client';
import { useState, useEffect } from 'react';

type Item = { 
  id: number; 
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

const emptyForm = { 
  name: '',
  email: '',
  role: 'editor',
  isActive: true,
  password: ''
};

export default function KullanicilarPage() {
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
      const res = await fetch('/api/admin/kullanicilar');
      const data = await res.json();
      setItems(data.users ?? []);
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
      name: item.name,
      email: item.email,
      role: item.role,
      isActive: item.isActive,
      password: '' // Don't populate password for edit
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
      const res = await fetch('/api/admin/kullanicilar', {
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
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/kullanicilar?id=${id}`, { method: 'DELETE' });
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
        <h1 className="text-2xl font-bold">Kullanıcılar</h1>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input 
                  type="email" 
                  className="w-full border p-2 rounded"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select 
                  className="w-full border p-2 rounded"
                  value={form.role}
                  onChange={e => setForm({...form, role: e.target.value})}
                >
                  <option value="admin">Yönetici (Admin)</option>
                  <option value="editor">Editör (Editor)</option>
                  <option value="viewer">İzleyici (Viewer)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre {editId && <span className="text-xs text-gray-500">(Değiştirmeyecekseniz boş bırakın)</span>}
                </label>
                <input 
                  type="password" 
                  className="w-full border p-2 rounded"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  required={!editId}
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
          <div className="p-4 text-center text-gray-500">Henüz kullanıcı yok.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Giriş</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleString('tr-TR') : 'Hiç girmedi'}
                  </td>
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
