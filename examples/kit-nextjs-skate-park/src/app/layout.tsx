import "./globals.css";
import { Roboto } from "next/font/google";
import { GoogleAnalytics } from "@/components/GoogleAnalyticsPageView";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <GoogleAnalytics />
        <link
          rel="preconnect"
          href="https://edge-platform-staging.sitecore-staging.cloud"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
