import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { generatePageMetadata } from '@/lib/metadata';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = generatePageMetadata({
  title: 'İletişim — Randevu Al | CLASS AUTO Antalya',
  description:
    "CLASS AUTO Antalya oto servis ile iletişime geçin. Güzeloba Mahallesi Havaalanı Caddesi No:11/D, Muratpaşa'da hizmetinizdeyiz.",
  slug: 'iletisim',
  keywords: ['CLASS AUTO iletişim', 'Antalya oto servis randevu', 'Muratpaşa oto servis telefon'],
});

const { contact, address, workingHours } = SITE_CONFIG;

const whatsappUrl =
  contact.whatsapp !== 'ONAY_BEKLIYOR'
    ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(contact.whatsappMessage)}`
    : null;

/* Kart stili */
const CARD: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E2E6EA',
  borderRadius: '14px',
  padding: '24px',
};

export default function ContactPage() {
  return (
    <>
      {/* ── Sayfa başlığı ── */}
      <section style={{ paddingTop: '130px', paddingBottom: '48px', background: '#F5F6F7', borderBottom: '1px solid #E2E6EA' }}>
        <div className="container-site">
          <nav aria-label="Breadcrumb">
            <ol style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#66717C', listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
              <li><Link href="/" style={{ color: '#66717C', textDecoration: 'none' }}>Ana Sayfa</Link></li>
              <li aria-hidden>/</li>
              <li style={{ color: '#1D252D', fontWeight: 600 }}>İletişim</li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: 'clamp(1.75rem,4vw,2.75rem)', fontWeight: 700, color: '#1D252D', marginBottom: '12px' }}>
            <span style={{ color: '#E30613' }}>İletişim</span> ve Randevu
          </h1>
          <p style={{ color: '#66717C', fontSize: '1.0625rem', maxWidth: '600px', margin: 0 }}>
            Aracınız için randevu almak veya soru sormak istiyorsanız aşağıdaki formu doldurabilir ya da doğrudan bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </section>

      {/* ── İçerik ── */}
      <section style={{ background: '#F5F6F7', padding: '4rem 0' }}>
        <div className="container-site">
          <div className="grid lg:grid-cols-5 gap-8">

            {/* Sol — İletişim Bilgileri */}
            <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Adres */}
              <div style={CARD}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(227,6,19,0.08)', border: '1px solid rgba(227,6,19,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E30613', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1D252D', margin: 0 }}>Adresimiz</h2>
                </div>
                <p style={{ color: '#66717C', fontSize: '14px', lineHeight: 1.7, marginBottom: '4px' }}>{address.full}</p>
                <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '14px' }}>{address.landmark}</p>
                <a
                  href={address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E30613', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  Yol Tarifi Al
                </a>
              </div>

              {/* Telefon */}
              <div style={CARD}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(227,6,19,0.08)', border: '1px solid rgba(227,6,19,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E30613', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.35h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 7.06 7.06l1-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1D252D', margin: 0 }}>Telefon</h2>
                </div>
                {contact.phone !== 'ONAY_BEKLIYOR' ? (
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} style={{ color: '#1D252D', fontSize: '20px', fontWeight: 700, textDecoration: 'none' }}>
                    {contact.phoneDisplay}
                  </a>
                ) : (
                  <p style={{ color: '#66717C', fontSize: '14px', fontStyle: 'italic' }}>Form veya WhatsApp üzerinden ulaşın.</p>
                )}
              </div>

              {/* WhatsApp */}
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...CARD, display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', transition: 'border-color 0.2s' }}
                  className="wa-card"
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#1D252D', fontWeight: 600, fontSize: '14px', margin: '0 0 2px' }}>WhatsApp ile Yaz</p>
                    <p style={{ color: '#66717C', fontSize: '12px', margin: 0 }}>Hızlı yanıt için tercih edin</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              ) : null}

              {/* Çalışma Saatleri */}
              <div style={CARD}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(227,6,19,0.08)', border: '1px solid rgba(227,6,19,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E30613', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1D252D', margin: 0 }}>Çalışma Saatleri</h2>
                </div>
                <dl style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {workingHours.schedule.map((day) => (
                    <div key={day.day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <dt style={{ color: '#66717C' }}>{day.day}</dt>
                      <dd style={{ color: day.open ? '#1D252D' : '#9CA3AF', fontWeight: day.open ? 600 : 400 }}>{day.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Harita */}
              <div style={{ ...CARD, padding: 0, overflow: 'hidden', height: '200px' }}>
                <a
                  href={address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', height: '100%', background: '#F5F6F7', textDecoration: 'none', color: '#66717C' }}
                  aria-label="Google Haritalar'da görüntüle"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E30613" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1D252D' }}>Haritada Gör</span>
                  <span style={{ fontSize: '11px', textAlign: 'center', padding: '0 16px', color: '#9CA3AF' }}>{address.full}</span>
                </a>
              </div>
            </div>

            {/* Sağ — Form */}
            <div className="lg:col-span-3">
              <div style={{ ...CARD, padding: '2rem' }}>
                <h2 style={{ fontFamily: 'Oswald, Arial Narrow, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#1D252D', marginBottom: '8px' }}>
                  Randevu Formu
                </h2>
                <p style={{ color: '#66717C', fontSize: '14px', marginBottom: '28px' }}>
                  Formu doldurun, en kısa sürede sizi arayalım.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
        <style>{`.wa-card:hover { border-color: rgba(37,211,102,0.4) !important; }`}</style>
      </section>
    </>
  );
}
