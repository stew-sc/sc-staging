import "./globals.css";
import { Roboto } from "next/font/google";

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
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YW6R9JD6YV"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YW6R9JD6YV');
            `,
          }}
        />
        <link
          rel="preconnect"
          href="https://edge-platform.sitecorecloud.io"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
