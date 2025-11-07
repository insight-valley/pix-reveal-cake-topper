import type { Metadata, Viewport } from "next";

import "../src/index.css";

export const metadata: Metadata = {
  title: "Cake Topper Generator - Crie Toppers Únicos com IA",
  description:
    "Gere toppers de bolo personalizados usando inteligência artificial. Crie designs únicos e mágicos para suas celebrações especiais.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9876"
  ),
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/pwa-icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/pwa-icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/pwa-icons/icon-128x128.png", sizes: "128x128" },
      { url: "/pwa-icons/icon-512x512.png", sizes: "512x512" },
    ],
  },
  openGraph: {
    title: "Cake Topper Generator - Crie Toppers Únicos com IA",
    description:
      "Gere toppers de bolo personalizados usando inteligência artificial. Crie designs únicos e mágicos para suas celebrações especiais.",
    type: "website",
    url: "https://cake-topper-generator.app",
    images: [{ url: "/pwa-icons/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cake Topper Generator",
    description: "Crie toppers de bolo únicos com IA",
    images: ["/pwa-icons/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#e91e63",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
