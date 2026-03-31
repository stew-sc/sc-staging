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

/**
 * Loads GA4 following Google's standard tag installation.
 * `gtag('config', ...)` handles the initial page view automatically.
 * Client-side navigations are tracked via useEffect on pathname changes.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const initialPathRef = useRef(pathname);

  useEffect(() => {
    if (pathname === initialPathRef.current) return;
    if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return;

    window.gtag('event', 'page_view', {
      page_path: pathname + window.location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
