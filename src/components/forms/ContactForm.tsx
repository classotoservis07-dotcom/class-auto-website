'use client';

import { useActionState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { submitContactForm, type FormState } from '@/app/(site)/actions/contact';
import { SERVICE_OPTIONS } from '@/lib/schemas';
import { GOOGLE_ADS_ID, GOOGLE_ADS_LABELS } from '@/lib/googleAds';

const initialState: FormState = { status: 'idle', message: '' };

export default function ContactForm() {
  const [state, action, isPending] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  // Prevents double-firing (React StrictMode dev + concurrent renders)
  const conversionSentRef = useRef(false);

  useEffect(() => {
    // Guard: only run when status changes TO 'success'
    if (state.status !== 'success') {
      // Reset guard when user can submit again (status leaves 'success')
      if (state.status === 'idle') conversionSentRef.current = false;
      return;
    }

    formRef.current?.reset();

    // Prevent double-firing in the same success cycle
    if (conversionSentRef.current) return;
    conversionSentRef.current = true;

    // ── Google Ads Form Conversion ────────────────────────────────────
    // Fires ONLY after backend confirms success — not on submit click,
    // not on validation error, not on page load.
    // Uses direct window.gtag call to avoid any wrapper abstraction issues.
    // ─────────────────────────────────────────────────────────────────
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gtag = (window as any).gtag;
      if (typeof gtag === 'function') {
        // Primary: Google Ads Conversion
        gtag('event', 'conversion', {
          send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LABELS.form}`,
        });
        // Secondary: Analytics event
        gtag('event', 'lead_form_submit', {
          event_category: 'lead',
          event_label:    'form_success',
        });
      }
    } catch {
      // Silent fail — never break the UI
    }
  }, [state.status]);

  const fieldError = (name: string) =>
    state.errors?.[name]?.[0];


  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      aria-label="İletişim ve randevu formu"
    >
      {/* Honeypot — görünmez, botlara tuzak */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
        <label htmlFor="_hp">Boş bırakın</label>
        <input type="text" id="_hp" name="_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Ad Soyad */}
        <div className="form-field">
          <label htmlFor="fullName" className="form-label required">Ad Soyad</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            autoComplete="name"
            placeholder="Adınız ve soyadınız"
            required
            className={`form-input ${fieldError('fullName') ? 'error' : ''}`}
            aria-describedby={fieldError('fullName') ? 'fullName-error' : undefined}
            aria-invalid={!!fieldError('fullName')}
          />
          {fieldError('fullName') && (
            <span id="fullName-error" className="form-error" role="alert">
              {fieldError('fullName')}
            </span>
          )}
        </div>

        {/* Telefon */}
        <div className="form-field">
          <label htmlFor="phone" className="form-label required">Telefon</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            autoComplete="tel"
            placeholder="0 5XX XXX XX XX"
            required
            className={`form-input ${fieldError('phone') ? 'error' : ''}`}
            aria-describedby={fieldError('phone') ? 'phone-error' : undefined}
            aria-invalid={!!fieldError('phone')}
          />
          {fieldError('phone') && (
            <span id="phone-error" className="form-error" role="alert">
              {fieldError('phone')}
            </span>
          )}
        </div>

        {/* Araç Marka ve Model */}
        <div className="form-field">
          <label htmlFor="vehicleMakeModel" className="form-label required">Araç Marka ve Model</label>
          <input
            type="text"
            id="vehicleMakeModel"
            name="vehicleMakeModel"
            placeholder="Örn: Renault Clio 2019"
            required
            className={`form-input ${fieldError('vehicleMakeModel') ? 'error' : ''}`}
            aria-describedby={fieldError('vehicleMakeModel') ? 'vehicle-error' : undefined}
            aria-invalid={!!fieldError('vehicleMakeModel')}
          />
          {fieldError('vehicleMakeModel') && (
            <span id="vehicle-error" className="form-error" role="alert">
              {fieldError('vehicleMakeModel')}
            </span>
          )}
        </div>

        {/* Plaka */}
        <div className="form-field">
          <label htmlFor="plate" className="form-label">Plaka <span className="text-[#6B7280] text-xs">(isteğe bağlı)</span></label>
          <input
            type="text"
            id="plate"
            name="plate"
            placeholder="07 ABC 123"
            className="form-input"
          />
        </div>

        {/* İstenen Hizmet */}
        <div className="form-field sm:col-span-2">
          <label htmlFor="service" className="form-label required">İstenen Hizmet</label>
          <select
            id="service"
            name="service"
            required
            className={`form-input form-select ${fieldError('service') ? 'error' : ''}`}
            aria-describedby={fieldError('service') ? 'service-error' : undefined}
            aria-invalid={!!fieldError('service')}
            defaultValue=""
          >
            <option value="" disabled>Hizmet seçiniz...</option>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {fieldError('service') && (
            <span id="service-error" className="form-error" role="alert">
              {fieldError('service')}
            </span>
          )}
        </div>

        {/* Mesaj */}
        <div className="form-field sm:col-span-2">
          <label htmlFor="message" className="form-label required">Mesajınız</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Aracınızla ilgili detayları ve talebinizi buraya yazabilirsiniz..."
            required
            className={`form-input resize-none ${fieldError('message') ? 'error' : ''}`}
            aria-describedby={fieldError('message') ? 'message-error' : undefined}
            aria-invalid={!!fieldError('message')}
          />
          {fieldError('message') && (
            <span id="message-error" className="form-error" role="alert">
              {fieldError('message')}
            </span>
          )}
        </div>

        {/* KVKK Onayı */}
        <div className="form-field sm:col-span-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="kvkk"
              required
              className="mt-0.5 w-4 h-4 accent-[#C8281E] flex-shrink-0 cursor-pointer"
              aria-describedby={fieldError('kvkk') ? 'kvkk-error' : undefined}
              aria-invalid={!!fieldError('kvkk')}
            />
            <span className="text-sm text-[#AEB3B8] leading-relaxed">
              <Link href="/kvkk" className="text-[#C8281E] hover:underline" target="_blank">
                KVKK Aydınlatma Metni
              </Link>
              &apos;ni okudum ve kişisel verilerimin işlenmesine onay veriyorum.
              <span className="text-[#C8281E] ml-1">*</span>
            </span>
          </label>
          {fieldError('kvkk') && (
            <span id="kvkk-error" className="form-error" role="alert">
              {fieldError('kvkk')}
            </span>
          )}
        </div>
      </div>

      {/* Durum mesajı */}
      {state.status === 'success' && (
        <div
          className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {state.message}
          </div>
        </div>
      )}
      {(state.status === 'error' || state.status === 'validation') && (
        <div
          className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {state.message}
          </div>
        </div>
      )}

      {/* Gönder butonu */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full sm:w-auto justify-center"
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Gönderiliyor...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Mesajı Gönder
            </>
          )}
        </button>
      </div>

      <p className="mt-3 text-xs text-[#6B7280]">
        * Zorunlu alan. Bilgileriniz yalnızca tarafınızla iletişim kurmak amacıyla kullanılır.
      </p>
    </form>
  );
}
