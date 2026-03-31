'use client';

import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/google-analytics';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Standard GA4 tag matching Google's recommended installation.
 * Initial page view is sent automatically by gtag('config', ...).
 * Client-side SPA navigations are tracked automatically by GA4's
 * Enhanced Measurement (detects History API pushState/replaceState).
 * @see https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
      <Script
        id="google-analytics-lib"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
    </>
  );
}

export function sendGAEvent(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}
