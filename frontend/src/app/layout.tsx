import "./globals.css";

export const metadata = {
  title: "AegisPulse",
  description: "Realtime anomaly detection and incident response",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

