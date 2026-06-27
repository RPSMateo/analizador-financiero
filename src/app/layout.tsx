import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://retirolibre.com.ar"),
  title: "RetiroLibre — Simulador de jubilación para freelancers argentinos",
  description:
    "Calculá cuánto necesitás ahorrar para jubilarte como autónomo o freelancer en Argentina. Con inflación real y 3 escenarios de inversión.",
  alternates: { canonical: "/" },
  verification: {
    google: "ZnBBOD48sBGl0eRDKYlLnqcUICq_sCFEuYgiskflDVU",
  },
  openGraph: {
    title: "RetiroLibre — Simulador de jubilación para freelancers argentinos",
    description:
      "Calculá cuánto necesitás ahorrar para jubilarte como autónomo o freelancer en Argentina.",
    url: "/",
    siteName: "RetiroLibre",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RetiroLibre — Simulador de jubilación para freelancers argentinos",
    description:
      "Calculá cuánto necesitás ahorrar para jubilarte como autónomo o freelancer en Argentina.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
