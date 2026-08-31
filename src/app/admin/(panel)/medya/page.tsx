'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface MediaItem {
  id: number;
  url: string;
  filename: string;
  originalName: string;
  altText?: string | null;
  title?: string | null;
  description?: string | null;
  width?: number | null;
  height?: number | null;
  size: number;
  mimeType: string;
  folder: string;
  createdAt: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editMeta, setEditMeta] = useState<{ id: number; altText: string; title: string; description: string } | null>(null);
  const [savingMeta, setSavingMeta] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const load = useCallback(async (p = 1, q = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (q) params.set('search', q);
      const res = await fetch(`/api/admin/media?${params}`);
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      setPage(data.page ?? 1);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      showMsg('error', 'Medya listesi alınamadı.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(1, ''); }, [load]);

  const handleSearch = (q: string) => {
    setSearch(q);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => load(1, q), 400);
  };

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Yükleniyor ${i + 1}/${files.length}: ${file.name}`);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) { successCount++; } else { errorCount++; }
      } catch { errorCount++; }
    }

    setUploading(false);
    setUploadProgress('');
    if (successCount > 0) showMsg('success', `${successCount} dosya başarıyla yüklendi.${errorCount > 0 ? ` ${errorCount} dosya başarısız.` : ''}`);
    else showMsg('error', `${errorCount} dosya yüklenemedi.`);
    load(1, search);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) uploadFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) uploadFiles(files);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`"${item.originalName}" dosyasını silmek istediğinizden emin misiniz?\n\nBu dosya başka sayfalarda kullanılıyorsa içerik bozulabilir.`)) return;
    setDeleting(item.id);
    try {
      const res = await fetch(`/api/admin/media?id=${item.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showMsg('success', 'Dosya silindi.');
        if (selected?.id === item.id) setSelected(null);
        load(page, search);
      } else {
        showMsg('error', data.error ?? 'Silinemedi.');
      }
    } catch {
      showMsg('error', 'Bağlantı hatası.');
    } finally {
      setDeleting(null);
    }
  };

  const startEditMeta = (item: MediaItem) => {
    setEditMeta({
      id: item.id,
      altText: item.altText ?? '',
      title: item.title ?? '',
      description: item.description ?? '',
    });
  };

  const saveEditMeta = async () => {
    if (!editMeta) return;
    setSavingMeta(true);
    try {
      const res = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editMeta),
      });
      const data = await res.json();
      if (data.success) {
        showMsg('success', 'Meta bilgiler kaydedildi.');
        setEditMeta(null);
        load(page, search);
        if (selected?.id === data.media.id) setSelected(data.media);
      } else {
        showMsg('error', data.error ?? 'Kaydedilemedi.');
      }
    } catch {
      showMsg('error', 'Bağlantı hatası.');
    } finally {
      setSavingMeta(false);
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f9fafb' }}>Medya Kütüphanesi</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            {total > 0 ? `${total} dosya yüklendi` : 'Henüz dosya yüklenmedi'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="admin-btn-primary"
          >
            {uploading ? `⏳ ${uploadProgress || 'Yükleniyor...'}` : '📁 Görsel Yükle'}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          marginBottom: '16px', padding: '12px 18px', borderRadius: '10px',
          background: message.type === 'success' ? '#064e3b' : '#450a0a',
          border: `1px solid ${message.type === 'success' ? '#065f46' : '#7f1d1d'}`,
          color: message.type === 'success' ? '#34d399' : '#f87171',
          fontSize: '14px', fontWeight: 600,
        }}>
          {message.text}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="search"
          placeholder="Dosya adı veya alt metin ara..."
          className="admin-input"
          style={{ flex: '1', minWidth: '240px', maxWidth: '400px' }}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '8px 12px', borderRadius: '8px 0 0 8px', border: 'none',
              background: viewMode === 'grid' ? '#dc2626' : '#374151',
              color: '#f9fafb', cursor: 'pointer', fontSize: '14px',
            }}
            title="Izgara görünümü"
          >⊞</button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '8px 12px', borderRadius: '0 8px 8px 0', border: 'none',
              background: viewMode === 'list' ? '#dc2626' : '#374151',
              color: '#f9fafb', cursor: 'pointer', fontSize: '14px',
            }}
            title="Liste görünümü"
          >≡</button>
        </div>
      </div>

      {/* Drop Zone (when empty or drag over) */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? '#dc2626' : '#374151'}`,
          borderRadius: '12px',
          background: dragOver ? '#1a0a0a' : 'transparent',
          padding: dragOver ? '32px' : '0',
          transition: 'all 0.2s',
          marginBottom: items.length > 0 ? '20px' : '0',
        }}
      >
        {dragOver && (
          <div style={{ textAlign: 'center', color: '#dc2626', fontWeight: 600 }}>
            <div style={{ fontSize: '40px' }}>📥</div>
            <p>Dosyaları bırakın</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Media Grid/List */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '48px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
              <p>Yükleniyor...</p>
            </div>
          ) : items.length === 0 ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                textAlign: 'center', color: '#6b7280', padding: '64px 24px',
                border: `2px dashed ${dragOver ? '#dc2626' : '#374151'}`,
                borderRadius: '12px', cursor: 'pointer',
                background: dragOver ? '#1a0a0a' : '#111827',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>🖼️</div>
              <p style={{ fontWeight: 600, color: '#f9fafb', marginBottom: '8px' }}>Henüz görsel yüklenmemiş</p>
              <p style={{ fontSize: '14px' }}>Görselleri sürükleyip bırakın veya tıklayarak seçin</p>
              <p style={{ fontSize: '12px', marginTop: '8px' }}>PNG, JPG, WebP, AVIF, SVG · Maks. 10 MB</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  style={{
                    background: '#111827',
                    border: selected?.id === item.id ? '2px solid #dc2626' : '2px solid transparent',
                    borderRadius: '10px', padding: '8px', cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{ width: '100%', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '6px', background: '#1f2937', marginBottom: '8px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.altText ?? item.originalName}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                    {item.originalName}
                  </p>
                  <p style={{ color: '#4b5563', fontSize: '10px', margin: '2px 0 0' }}>{formatSize(item.size)}</p>
                </div>
              ))}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Görsel</th>
                  <th>Dosya Adı</th>
                  <th>Boyut</th>
                  <th>Ölçü</th>
                  <th>Tarih</th>
                  <th style={{ width: '80px' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    style={{ cursor: 'pointer', background: selected?.id === item.id ? 'rgba(220,38,38,0.08)' : undefined }}
                  >
                    <td>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.altText ?? ''}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', background: '#1f2937' }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </td>
                    <td>
                      <p style={{ color: '#f9fafb', fontSize: '13px', marginBottom: '2px' }}>{item.originalName}</p>
                      <p style={{ color: '#6b7280', fontSize: '11px' }}>{item.mimeType}</p>
                    </td>
                    <td style={{ color: '#9ca3af', fontSize: '13px' }}>{formatSize(item.size)}</td>
                    <td style={{ color: '#9ca3af', fontSize: '13px' }}>
                      {item.width && item.height ? `${item.width}×${item.height}` : '—'}
                    </td>
                    <td style={{ color: '#9ca3af', fontSize: '12px' }}>{formatDate(item.createdAt)}</td>
                    <td>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                        disabled={deleting === item.id}
                        style={{ background: 'none', border: '1px solid #374151', borderRadius: '6px', color: '#ef4444', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        {deleting === item.id ? '⏳' : 'Sil'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '20px' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => load(p, search)}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', border: 'none',
                    background: p === page ? '#dc2626' : '#374151',
                    color: '#f9fafb', cursor: 'pointer', fontSize: '13px',
                  }}
                >{p}</button>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ width: '280px', flexShrink: 0 }}>
            <div className="admin-card" style={{ position: 'sticky', top: '24px' }}>
              <div style={{ marginBottom: '12px', textAlign: 'center', background: '#111827', borderRadius: '8px', padding: '12px', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.url}
                  alt={selected.altText ?? ''}
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong style={{ color: '#f9fafb' }}>Dosya:</strong> {selected.originalName}</div>
                <div><strong style={{ color: '#f9fafb' }}>Tür:</strong> {selected.mimeType}</div>
                <div><strong style={{ color: '#f9fafb' }}>Boyut:</strong> {formatSize(selected.size)}</div>
                {selected.width && <div><strong style={{ color: '#f9fafb' }}>Ölçü:</strong> {selected.width}×{selected.height}px</div>}
                <div><strong style={{ color: '#f9fafb' }}>Tarih:</strong> {formatDate(selected.createdAt)}</div>
                <div style={{ wordBreak: 'break-all' }}>
                  <strong style={{ color: '#f9fafb' }}>URL:</strong>{' '}
                  <code style={{ fontSize: '11px', color: '#9ca3af' }}>{selected.url}</code>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                <button
                  onClick={() => { navigator.clipboard.writeText(selected.url); showMsg('success', 'URL kopyalandı.'); }}
                  className="admin-btn-secondary"
                  style={{ fontSize: '12px', width: '100%' }}
                >
                  📋 URL Kopyala
                </button>
                <button
                  onClick={() => startEditMeta(selected)}
                  className="admin-btn-secondary"
                  style={{ fontSize: '12px', width: '100%' }}
                >
                  ✏️ Meta Düzenle
                </button>
                <button
                  onClick={() => handleDelete(selected)}
                  disabled={deleting === selected.id}
                  style={{ background: 'none', border: '1px solid #7f1d1d', borderRadius: '8px', color: '#ef4444', padding: '8px', fontSize: '12px', cursor: 'pointer', width: '100%' }}
                >
                  {deleting === selected.id ? '⏳ Siliniyor...' : '🗑️ Sil'}
                </button>
              </div>

              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '12px', cursor: 'pointer', padding: 0 }}
              >
                ✕ Kapat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Meta Edit Modal */}
      {editMeta && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '480px' }}>
            <h3 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '16px', marginBottom: '20px' }}>Meta Bilgileri Düzenle</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="admin-label">Alt Metin</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editMeta.altText}
                  onChange={(e) => setEditMeta({ ...editMeta, altText: e.target.value })}
                  placeholder="Görseli açıklayan kısa bir metin"
                />
              </div>
              <div>
                <label className="admin-label">Başlık</label>
                <input
                  type="text"
                  className="admin-input"
                  value={editMeta.title}
                  onChange={(e) => setEditMeta({ ...editMeta, title: e.target.value })}
                  placeholder="Görsel başlığı (opsiyonel)"
                />
              </div>
              <div>
                <label className="admin-label">Açıklama</label>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={editMeta.description}
                  onChange={(e) => setEditMeta({ ...editMeta, description: e.target.value })}
                  placeholder="Detaylı açıklama (opsiyonel)"
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditMeta(null)} className="admin-btn-secondary" disabled={savingMeta}>İptal</button>
              <button onClick={saveEditMeta} className="admin-btn-primary" disabled={savingMeta}>
                {savingMeta ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
