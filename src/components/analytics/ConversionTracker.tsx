'use client';

/**
 * ConversionTracker — Client Component
 *
 * - Stores UTM params + GCLID in sessionStorage on page load
 * - Tracks conversion events via dataLayer.push
 * - Only active if window.dataLayer exists (GTM loaded)
 * - Attaches delegated event listeners to tel: and wa.me links
 */

import { useEffect } from 'react';

// Extend window for GTM dataLayer
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function push(event: string, params?: Record<string, unknown>) {
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
  push('phone_click', { event_source: source || 'unknown' });
}

export function trackWhatsAppClick(source?: string) {
  push('whatsapp_click', { event_source: source || 'unknown' });
}

export function trackAppointmentFormSubmit(serviceType?: string) {
  push('appointment_form_submit', { service_type: serviceType });
}

export function trackDirectionsClick() {
  push('directions_click');
}

export function trackCampaignClick(campaignTitle?: string) {
  push('campaign_click', { campaign_title: campaignTitle });
}

export function trackMapOpen() {
  push('map_open');
}

export function trackServiceContact(serviceName?: string) {
  push('service_contact', { service_name: serviceName });
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

    // 2) Delegate click tracking for tel: and wa.me links
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href') || '';

      if (href.startsWith('tel:')) {
        trackPhoneClick(document.title);
      } else if (href.includes('wa.me') || href.includes('whatsapp')) {
        trackWhatsAppClick(document.title);
      } else if (href.includes('maps.google') || href.includes('goo.gl/maps')) {
        trackDirectionsClick();
      }
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return null;
}
