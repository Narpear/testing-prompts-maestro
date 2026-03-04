import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maestro Intent Lab",
  description: "Fashion image generation · intent-based prompt enhancement",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
