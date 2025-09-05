import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "TrailFuel",
  description: "Plan, nutrition et import GPX pour trail running",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh bg-white text-black antialiased">
        <Header />
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
