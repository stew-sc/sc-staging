import { GA_MEASUREMENT_ID } from '@/lib/google-analytics';

/**
 * Standard GA4 tag rendered directly in <head>, matching Google's
 * recommended installation: "immediately after the <head> element."
 * No next/script needed — standard <script> tags ensure execution
 * before hydration, avoiding afterInteractive timing issues.
 *
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
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}
