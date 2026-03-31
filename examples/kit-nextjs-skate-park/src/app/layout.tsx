import "./globals.css";
import { Suspense } from "react";
import { Roboto } from "next/font/google";
import { GoogleAnalyticsPageView } from "@/components/GoogleAnalyticsPageView";
import { GA_MEASUREMENT_ID } from "@/lib/google-analytics";

// Configure the font
const roboto = Roboto({
  subsets: ["latin"], // required subset
  weight: ["300", "400", "500", "700"], // weights you need
  display: "swap", // ensures non-blocking text rendering
  variable: "--font-roboto", // optional CSS variable for easier usage
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        {GA_MEASUREMENT_ID ? (
          <>
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
        ) : null}
        <link
          rel="preconnect"
          href="https://edge-platform.sitecorecloud.io"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {GA_MEASUREMENT_ID ? (
          <Suspense fallback={null}>
            <GoogleAnalyticsPageView />
          </Suspense>
        ) : null}
        {children}
      </body>
    </html>
  );
}
