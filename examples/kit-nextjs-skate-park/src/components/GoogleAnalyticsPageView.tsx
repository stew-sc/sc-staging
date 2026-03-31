'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
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
 * The inline config script runs first to define dataLayer/gtag before the
 * external gtag.js library loads. Uses `send_page_view: false` so we
 * control exactly when page_view events fire (no duplicates).
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const isScriptLoaded = useRef(false);
  const lastSentPath = useRef<string | null>(null);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !pathname) return;
    if (!isScriptLoaded.current) return;
    if (lastSentPath.current === pathname) return;

    lastSentPath.current = pathname;
    sendPageView(pathname);
  }, [pathname]);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          isScriptLoaded.current = true;
          if (pathname && lastSentPath.current !== pathname) {
            lastSentPath.current = pathname;
            sendPageView(pathname);
          }
        }}
      />
    </>
  );
}
