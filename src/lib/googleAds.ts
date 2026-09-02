/**
 * Google Ads Dönüşüm Takibi — Merkezi Konfigürasyon
 *
 * ⚠️ TODO: Aşağıdaki 3 placeholder label'ı gerçek değerleriyle değiştir.
 * Google Ads → Araçlar → Dönüşümler → İlgili dönüşümü seç → Etiket
 *
 * Örnek gerçek label: "AbCdEfGhIjKlMnOp"
 */

export const GOOGLE_ADS_ID = 'AW-18419853908';

export const GOOGLE_ADS_LABELS = {
  /** TODO: Replace with real label from Google Ads → WhatsApp conversion */
  whatsapp: 'WHATSAPP_CONVERSION_LABEL',
  /** TODO: Replace with real label from Google Ads → Phone conversion */
  phone:    'PHONE_CONVERSION_LABEL',
  /** TODO: Replace with real label from Google Ads → Form/lead conversion */
  form:     'FORM_CONVERSION_LABEL',
} as const;

export type ConversionType = keyof typeof GOOGLE_ADS_LABELS;

// Extend window for gtag and dataLayer
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

const ANALYTICS_EVENTS: Record<ConversionType, { event: string; category: string; label: string }> = {
  whatsapp: { event: 'whatsapp_click',    category: 'contact', label: 'whatsapp' },
  phone:    { event: 'phone_click',       category: 'contact', label: 'phone' },
  form:     { event: 'lead_form_submit',  category: 'lead',    label: 'form_success' },
};

/**
 * trackGoogleAdsConversion
 *
 * - Always fires the analytics event (whatsapp_click, phone_click, lead_form_submit)
 * - Only fires gtag 'conversion' event when the label is NOT a placeholder
 *   (prevents sending invalid conversion data to Google Ads)
 * - Silent fail — never throws, never breaks the UI
 */
export function trackGoogleAdsConversion(type: ConversionType): void {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.gtag !== 'function') return;

    const { event, category, label } = ANALYTICS_EVENTS[type];
    const conversionLabel = GOOGLE_ADS_LABELS[type];
    const isPlaceholder = conversionLabel.endsWith('_CONVERSION_LABEL');

    // 1) Fire analytics event (always)
    window.gtag('event', event, {
      event_category: category,
      event_label:    label,
    });

    // 2) Fire Google Ads conversion (only when real label is set)
    if (!isPlaceholder) {
      window.gtag('event', 'conversion', {
        send_to: `${GOOGLE_ADS_ID}/${conversionLabel}`,
      });
    }
  } catch {
    // Silent fail
  }
}
