'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { GA_MEASUREMENT_ID } from '@/lib/google-analytics';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __gaLastPageViewPath?: string;
  }
}

/**
 * Sends GA4 `page_view` when the App Router URL changes. Initial `gtag('config')`
 * uses `send_page_view: false` so every view is sent here — including after client
 * navigations and remounts (Suspense + useSearchParams can re-create this component).
 * Dedupe uses `window` so the same URL is not double-fired across remounts.
 */
export function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !pathname || typeof window.gtag !== 'function') {
      return;
    }

    const pagePath = searchString ? `${pathname}?${searchString}` : pathname;
    if (window.__gaLastPageViewPath === pagePath) {
      return;
    }
    window.__gaLastPageViewPath = pagePath;

    const pageLocation = `${window.location.origin}${pathname}${searchString ? `?${searchString}` : ''}`;

    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_location: pageLocation,
      page_title: typeof document !== 'undefined' ? document.title : '',
    });
  }, [pathname, searchString]);

  return null;
}
