import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Preview | Jadu-CMS",
  robots: { index: false, follow: false },
};

export default function PreviewRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="no-js">
      <head>
        <link
          rel="stylesheet"
          href="https://jaducdn.leeds.ac.uk/uol-ds/1.0.20/css/style.css"
        />
        <link rel="stylesheet" href="https://use.typekit.net/xpd0xwa.css" />
        <Script
          src="https://jaducdn.leeds.ac.uk/uol-ds/1.0.20/scripts/modernizr-custom.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        {children}
        <Script
          src="https://jaducdn.leeds.ac.uk/uol-ds/1.0.20/scripts/bundle.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
