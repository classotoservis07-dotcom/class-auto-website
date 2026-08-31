'use client';
import { useState, useRef, useCallback } from 'react';

interface MediaItem {
  id: number;
  url: string;
  filename: string;
  originalName: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  size: number;
  mimeType: string;
  createdAt: string;
}

interface MediaPickerProps {
  value: string; // current URL or empty string
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  accept?: string; // default: 'image/*'
}

export default function MediaPicker({ value, onChange, label, hint, accept = 'image/*' }: MediaPickerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryItems, setLibraryItems] = useState<MediaItem[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryPage, setLibraryPage] = useState(1);
  const [libraryTotal, setLibraryTotal] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadLibrary = useCallback(async (page = 1, search = '') => {
    setLibraryLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/media?${params}`);
      const data = await res.json();
      setLibraryItems(data.items ?? []);
      setLibraryTotal(data.total ?? 0);
      setLibraryPage(page);
    } catch {
      // ignore
    } finally {
      setLibraryLoading(false);
    }
  }, []);

  const openLibrary = () => {
    setShowLibrary(true);
    loadLibrary(1, '');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.media?.url) {
        onChange(data.media.url);
      } else {
        setUploadError(data.error ?? 'Yükleme başarısız.');
      }
    } catch {
      setUploadError('Bağlantı hatası. Tekrar deneyin.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const selectFromLibrary = (item: MediaItem) => {
    onChange(item.url);
    setShowLibrary(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {label && <label className="admin-label">{label}</label>}

      {/* Preview Area */}
      <div style={{
        width: '100%', minHeight: '140px', background: '#111827',
        border: '2px dashed #374151', borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative'
      }}>
        {value ? (
          <img
            src={value}
            alt="Önizleme"
            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#4b5563' }}>
            <div style={{ fontSize: '32px', marginBottom: '4px' }}>🖼️</div>
            <div style={{ fontSize: '12px' }}>Görsel seçilmedi</div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="admin-btn-secondary"
          style={{ fontSize: '13px' }}
        >
          {uploading ? '⏳ Yükleniyor...' : '📁 Bilgisayardan Yükle'}
        </button>
        <button
          type="button"
          onClick={openLibrary}
          className="admin-btn-secondary"
          style={{ fontSize: '13px' }}
        >
          🗂️ Medya Kütüphanesi
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{ background: 'none', border: '1px solid #374151', borderRadius: '8px', color: '#9ca3af', fontSize: '13px', padding: '6px 12px', cursor: 'pointer' }}
          >
            ✕ Kaldır
          </button>
        )}
      </div>

      {uploadError && (
        <p style={{ color: '#f87171', fontSize: '12px' }}>{uploadError}</p>
      )}
      {hint && <p style={{ color: '#6b7280', fontSize: '12px' }}>{hint}</p>}

      {/* Library Modal */}
      {showLibrary && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.8)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            background: '#1f2937', borderRadius: '16px', width: '100%',
            maxWidth: '900px', maxHeight: '85vh', display: 'flex',
            flexDirection: 'column', overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #374151', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ color: '#f9fafb', fontWeight: 600, fontSize: '16px', margin: 0 }}>Medya Kütüphanesi</h3>
              <button onClick={() => setShowLibrary(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>
            {/* Search */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #374151' }}>
              <input
                type="search"
                placeholder="Ara..."
                className="admin-input"
                value={librarySearch}
                onChange={(e) => {
                  setLibrarySearch(e.target.value);
                  loadLibrary(1, e.target.value);
                }}
              />
            </div>
            {/* Grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {libraryLoading ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>Yükleniyor...</div>
              ) : libraryItems.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>📂</div>
                  <p>Henüz medya yüklenmemiş.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                  {libraryItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectFromLibrary(item)}
                      style={{
                        background: '#111827', border: item.url === value ? '2px solid #dc2626' : '2px solid transparent',
                        borderRadius: '8px', padding: '8px', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', gap: '6px',
                        transition: 'border-color 0.15s'
                      }}
                      title={item.originalName}
                    >
                      <div style={{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '4px' }}>
                        <img
                          src={item.url}
                          alt={item.altText ?? item.originalName}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.replaceWith(Object.assign(document.createElement('div'), { textContent: '🖼️', style: 'font-size:32px;display:flex;align-items:center;justify-content:center;height:100%' })); }}
                        />
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
                        {item.originalName}
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '10px', margin: 0 }}>{formatSize(item.size)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Pagination */}
            {libraryTotal > 24 && (
              <div style={{ padding: '16px 24px', borderTop: '1px solid #374151', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {Array.from({ length: Math.ceil(libraryTotal / 24) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => loadLibrary(p, librarySearch)}
                    style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
                      background: p === libraryPage ? '#dc2626' : '#374151',
                      color: '#f9fafb', border: 'none'
                    }}
                  >{p}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
