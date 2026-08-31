'use client';

/**
 * UTMCapture — Client Component
 * Reads UTM params and GCLID from URL and stores them in sessionStorage.
 * Runs once on mount. No GTM/GA dependency.
 */

import { useEffect } from 'react';

export default function UTMCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid'];
      keys.forEach((key) => {
        const val = params.get(key);
        if (val) sessionStorage.setItem(key, val);
      });
    } catch {
      // sessionStorage not available (e.g. private mode)
    }
  }, []);

  return null;
}
