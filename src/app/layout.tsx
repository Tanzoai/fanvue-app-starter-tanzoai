import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fanvue App Starter",
  description: "Minimal Fanvue App example.",
  icons: {
    icon: "/logo192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
