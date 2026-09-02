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
  whatsapp: 'Tre9CM-YwuwcENTUos9E',
  phone:    'D3xvCIvQw-wcENTUos9E',
  form:     '7z2rCNHs0OwcENTUos9E',
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
 * - Fires the analytics event (whatsapp_click, phone_click, lead_form_submit)
 * - Fires gtag 'conversion' event when label is NOT a placeholder
 * - Silent fail — never throws, never breaks the UI
 */
export function trackGoogleAdsConversion(type: ConversionType): void {
  if (typeof window === 'undefined') return;

  const { event, category, label } = ANALYTICS_EVENTS[type];
  const conversionLabel = GOOGLE_ADS_LABELS[type];
  const isPlaceholder = conversionLabel.endsWith('_CONVERSION_LABEL');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtagFn = (window as any).gtag;

  try {
    // 1) Analytics event
    gtagFn('event', event, {
      event_category: category,
      event_label:    label,
    });
  } catch {
    // gtag not ready yet — silent fail
  }

  // 2) Google Ads conversion (only with real label)
  if (!isPlaceholder) {
    try {
      gtagFn('event', 'conversion', {
        send_to: `${GOOGLE_ADS_ID}/${conversionLabel}`,
      });
    } catch {
      // Silent fail
    }
  }
}
