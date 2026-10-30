import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "AquaRoute Sovereign AI | One Intelligence. Every Model. The Right Execution Path.",
  description:
    "Don't Choose an AI. Let AquaRoute Find Your Best AI. Discover, compare, benchmark, and execute AI workloads across local, private, and cloud models with hardware-aware routing and sustainability metrics.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon-192.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AquaRoute AI",
  },
  applicationName: "AquaRoute Sovereign AI",
  authors: [{ name: "AquaRoute Architecture Team" }],
  keywords: [
    "AI Routing",
    "Sovereign AI",
    "Local LLM",
    "Ollama",
    "Cloud AI",
    "Model Benchmarks",
    "Hardware Compatibility",
    "Green AI",
    "Carbon Emissions",
    "Water Footprint",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0D9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8F9FB] text-[#111318]">
        {children}
      </body>
    </html>
  );
}
