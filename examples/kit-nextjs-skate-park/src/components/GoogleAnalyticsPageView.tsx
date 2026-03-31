'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { GA_MEASUREMENT_ID } from '@/lib/google-analytics';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

function sendPageView(path: string) {
  window.gtag?.('event', 'page_view', {
    page_path: path + window.location.search,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * Loads GA4 via next/script and sends page_view on every route change.
 * Uses `send_page_view: false` to prevent gtag's auto-hit, then fires
 * explicit events — including an onLoad hit for the first page.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();

  const handleScriptLoad = useCallback(() => {
    if (pathname) {
      sendPageView(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !pathname || typeof window.gtag !== 'function') {
      return;
    }
    sendPageView(pathname);
  }, [pathname]);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`}
      </Script>
    </>
  );
}
