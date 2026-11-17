import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMKCC IT Helpdesk - วิทยาลัยชุมชนสมุทรสาคร",
  description: "ระบบแจ้งซ่อมและบริการด้านไอที วิทยาลัยชุมชนสมุทรสาคร ผ่าน LINE",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="min-h-screen antialiased flex flex-col">{children}</body>
    </html>
  );
}
