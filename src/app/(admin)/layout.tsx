import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Jadu-CMS",
  description: "Staging editor for JADU document pages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
