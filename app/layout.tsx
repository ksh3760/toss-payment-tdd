import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toss Payments TDD",
  description: "Test-Driven Development with Toss Payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
