'use client';

/**
 * ConversionTracker — Client Component
 *
 * - Stores UTM params + GCLID in sessionStorage on page load
 * - Tracks conversion events via dataLayer.push (GTM)
 * - Tracks Google Ads conversions via gtag (Google Ads)
 * - Attaches ONE delegated event listener to document — no duplicates on re-render
 * - tel: click  → trackGoogleAdsConversion('phone')
 * - wa.me click → trackGoogleAdsConversion('whatsapp')
 * - Form success → tracked in ContactForm component
 */

import { useEffect } from 'react';
import { trackGoogleAdsConversion } from '@/lib/googleAds';

function pushDataLayer(event: string, params?: Record<string, unknown>) {
  try {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event, ...params });
    }
  } catch {
    // Silent fail
  }
}

export function trackPhoneClick(source?: string) {
  pushDataLayer('phone_click', { event_source: source || 'unknown' });
}

export function trackWhatsAppClick(source?: string) {
  pushDataLayer('whatsapp_click', { event_source: source || 'unknown' });
}

export function trackAppointmentFormSubmit(serviceType?: string) {
  pushDataLayer('appointment_form_submit', { service_type: serviceType });
}

export function trackDirectionsClick() {
  pushDataLayer('directions_click');
}

export function trackCampaignClick(campaignTitle?: string) {
  pushDataLayer('campaign_click', { campaign_title: campaignTitle });
}

export function trackMapOpen() {
  pushDataLayer('map_open');
}

export function trackServiceContact(serviceName?: string) {
  pushDataLayer('service_contact', { service_name: serviceName });
}

export default function ConversionTracker() {
  useEffect(() => {
    // 1) Capture UTM params + GCLID from URL → sessionStorage
    try {
      const params = new URLSearchParams(window.location.search);
      const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid'];
      keys.forEach((key) => {
        const val = params.get(key);
        if (val) sessionStorage.setItem(key, val);
      });
    } catch {
      // sessionStorage might be unavailable
    }

    // 2) Delegated click handler — attached ONCE, no duplicate listeners on re-render
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href') || '';

      if (href.startsWith('tel:')) {
        // GTM dataLayer push
        trackPhoneClick(document.title);
        // Google Ads conversion + gtag analytics event
        trackGoogleAdsConversion('phone');

      } else if (href.includes('wa.me') || href.includes('whatsapp')) {
        // GTM dataLayer push
        trackWhatsAppClick(document.title);
        // Google Ads conversion + gtag analytics event
        trackGoogleAdsConversion('whatsapp');

      } else if (href.includes('maps.google') || href.includes('goo.gl/maps')) {
        trackDirectionsClick();
      }
    };

    document.addEventListener('click', handler);
    // Cleanup on unmount — prevents duplicate listeners across navigations
    return () => document.removeEventListener('click', handler);
  }, []); // [] = run once on mount only

  return null;
}
