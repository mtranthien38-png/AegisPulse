import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "AegisPulse",
  description: "Realtime anomaly detection and incident response",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
