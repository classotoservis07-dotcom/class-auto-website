'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('E-posta ve şifre alanlarını doldurun.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Giriş başarısız.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Sunucu bağlantısı kurulamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, background: '#dc2626', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 20, letterSpacing: '-1px' }}>CA</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#f9fafb', lineHeight: 1.2 }}>CLASS AUTO</div>
              <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Yönetim Paneli</div>
            </div>
          </div>
        </div>

        {/* Kart */}
        <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, padding: '32px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f9fafb', marginBottom: 6 }}>Giriş Yap</h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>Yönetim paneline erişmek için giriş yapın.</p>

          {error && (
            <div style={{ background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#f87171', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label" htmlFor="email">E-posta Adresi</label>
              <input
                className="admin-input"
                id="email"
                name="email"
                type="email"
                placeholder="yönetici@classauto.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label className="admin-label" htmlFor="password">Şifre</label>
              <input
                className="admin-input"
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
              <a href="#" style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none' }}
                onClick={(e) => { e.preventDefault(); alert('Şifre sıfırlama için sistem yöneticisiyle iletişime geçin.'); }}>
                Şifremi Unuttum
              </a>
            </div>

            <button
              className="admin-btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: 15, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Giriş yapılıyor...
                </>
              ) : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6b7280' }}>
          İlk kurulum yapılmadı mı?{' '}
          <a href="/admin/setup" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600 }}>Kurulum sayfası</a>
        </p>
      </div>
    </div>
  );
}
