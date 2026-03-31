'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { GA_MEASUREMENT_ID } from '@/lib/google-analytics';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a GA4 page_view on App Router client navigations. The inline gtag
 * snippet in layout only runs on full page loads, so this bridges SPA route changes.
 */
export function GoogleAnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const isFirstNavigation = useRef(true);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      return;
    }

    if (isFirstNavigation.current) {
      isFirstNavigation.current = false;
      return;
    }

    if (typeof window.gtag !== 'function' || !pathname) {
      return;
    }

    const pagePath = searchString ? `${pathname}?${searchString}` : pathname;
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pagePath,
    });
  }, [pathname, searchString]);

  return null;
}
