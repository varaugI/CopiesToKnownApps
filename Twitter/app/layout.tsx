import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Chirp — a Twitter-inspired social demo",
  description: "A polished, interactive social timeline prototype.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
