import type { Metadata, Viewport } from "next";
import ToastHost from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "CGV 시네마 다이어리",
  description: "파코니 NFC 굿즈 × CGV 앱 시네마 다이어리 프로토타입",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-cgv-gray-100">
        {children}
        <ToastHost />
      </body>
    </html>
  );
}
