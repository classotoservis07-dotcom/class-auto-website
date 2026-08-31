'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/setup')
      .then((r) => r.json())
      .then((data) => {
        if (!data.setupRequired) {
          router.replace('/admin/login');
        } else {
          setSetupRequired(true);
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Sunucu bağlantısı kurulamadı.');
        setLoading(false);
      });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim() || !form.email || !form.password || !form.confirmPassword)
      return 'Tüm alanları doldurun.';
    if (form.name.trim().length < 2) return 'Ad Soyad en az 2 karakter olmalıdır.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Geçerli bir e-posta adresi girin.';
    if (form.password.length < 8) return 'Şifre en az 8 karakter olmalıdır.';
    if (!/\d/.test(form.password)) return 'Şifre en az bir rakam içermelidir.';
    if (form.password !== form.confirmPassword) return 'Şifreler eşleşmiyor.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Bir hata oluştu.');
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/admin/login'), 2000);
      }
    } catch {
      setError('Sunucu bağlantısı kurulamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827' }}>
        <div style={{ color: '#9ca3af', fontSize: 14 }}>Yükleniyor...</div>
      </div>
    );
  }

  if (!setupRequired) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, background: '#dc2626', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>CA</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#f9fafb' }}>CLASS AUTO</div>
              <div style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase' }}>İlk Kurulum</div>
            </div>
          </div>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Yönetici hesabını oluşturun.</p>
        </div>

        <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, padding: 32 }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: 52, height: 52, background: '#064e3b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="26" height="26" fill="none" stroke="#34d399" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p style={{ color: '#34d399', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Hesap oluşturuldu!</p>
              <p style={{ color: '#6b7280', fontSize: 13 }}>Giriş sayfasına yönlendiriliyorsunuz...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div style={{ background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#f87171', fontSize: 13 }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label className="admin-label" htmlFor="name">Ad Soyad</label>
                <input className="admin-input" id="name" name="name" type="text" placeholder="Ahmet Yılmaz" value={form.name} onChange={handleChange} autoComplete="name" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="admin-label" htmlFor="email">E-posta</label>
                <input className="admin-input" id="email" name="email" type="email" placeholder="yönetici@classauto.com" value={form.email} onChange={handleChange} autoComplete="email" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="admin-label" htmlFor="password">Şifre</label>
                <input className="admin-input" id="password" name="password" type="password" placeholder="En az 8 karakter, 1 rakam" value={form.password} onChange={handleChange} autoComplete="new-password" />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="admin-label" htmlFor="confirmPassword">Şifre Tekrarı</label>
                <input className="admin-input" id="confirmPassword" name="confirmPassword" type="password" placeholder="Şifreyi tekrar girin" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" />
              </div>

              <button className="admin-btn-primary" type="submit" disabled={submitting} style={{ width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: 15 }}>
                {submitting ? 'Oluşturuluyor...' : 'Yönetici Hesabını Oluştur'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6b7280' }}>
          Zaten hesabınız var mı?{' '}
          <a href="/admin/login" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600 }}>Giriş yapın</a>
        </p>
      </div>
    </div>
  );
}
