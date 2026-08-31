import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'CLASS AUTO Yönetim Paneli',
    template: '%s | CA Panel',
  },
  robots: { index: false, follow: false },
};

// Admin layout — <html> ve <body> ROOT layout'ta açılıyor, burada KULLANILMAZ
// Sadece admin CSS ve stil tanımları buraya eklenir
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Inter, system-ui, -apple-system, sans-serif; background: #111827; color: #f9fafb; min-height: 100vh; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1f2937; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
        .admin-sidebar-link { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 8px; color: #9ca3af; text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.15s; cursor: pointer; border: none; background: none; width: 100%; }
        .admin-sidebar-link:hover { background: #1f2937; color: #f9fafb; }
        .admin-sidebar-link.active { background: rgba(220,38,38,0.1); color: #ef4444; }
        .admin-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.15s; text-decoration: none; }
        .admin-btn-primary:hover { background: #b91c1c; }
        .admin-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .admin-btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #1f2937; color: #d1d5db; border: 1px solid #374151; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.15s; text-decoration: none; }
        .admin-btn-secondary:hover { background: #374151; color: #f9fafb; }
        .admin-input { width: 100%; padding: 10px 12px; background: #1f2937; border: 1px solid #374151; border-radius: 8px; color: #f9fafb; font-size: 14px; outline: none; transition: border-color 0.15s; font-family: inherit; }
        .admin-input:focus { border-color: #dc2626; }
        .admin-input::placeholder { color: #6b7280; }
        .admin-label { display: block; font-size: 13px; font-weight: 600; color: #d1d5db; margin-bottom: 6px; }
        .admin-card { background: #1f2937; border: 1px solid #374151; border-radius: 12px; padding: 24px; }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .admin-table th { padding: 12px 16px; text-align: left; color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #374151; }
        .admin-table td { padding: 14px 16px; border-bottom: 1px solid #1f2937; color: #d1d5db; }
        .admin-table tr:hover td { background: rgba(255,255,255,0.02); }
        .admin-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .admin-badge-green { background: #064e3b; color: #34d399; }
        .admin-badge-yellow { background: #451a03; color: #fbbf24; }
        .admin-badge-red { background: #450a0a; color: #f87171; }
        .admin-badge-gray { background: #374151; color: #9ca3af; }
        .admin-badge-blue { background: #0c4a6e; color: #38bdf8; }
        select.admin-input option { background: #1f2937; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .admin-fade-in { animation: fadeIn 0.2s ease-out; }
      `}} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      {children}
    </>
  );
}
