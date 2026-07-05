import type { Metadata, Viewport } from "next";
import { Inter, Sora, Vazirmatn } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { LanguageProvider } from "@/components/language-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-fa",
  display: "swap",
});

// Runs before paint to set the correct direction/language and avoid a flash.
const dirScript = `(function(){try{var l=localStorage.getItem('aero-lang')||'fa';document.documentElement.lang=l;document.documentElement.dir=l==='fa'?'rtl':'ltr';}catch(e){}})();`;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AeroCast — Accurate Weather Forecasts, Minute by Minute",
    template: "%s · AeroCast",
  },
  description:
    "AeroCast delivers hyper-local, real-time weather forecasts, air quality and 7-day outlooks — powered by a MongoDB-backed platform and a beautiful, animated interface.",
  keywords: [
    "weather",
    "forecast",
    "weather app",
    "real-time weather",
    "air quality",
    "AeroCast",
  ],
  openGraph: {
    title: "AeroCast — Accurate Weather Forecasts",
    description:
      "Hyper-local, real-time forecasts with a beautiful animated interface.",
    type: "website",
    url: siteUrl,
    siteName: "AeroCast",
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroCast — Accurate Weather Forecasts",
    description: "Hyper-local, real-time forecasts with a beautiful UI.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#080d1e" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable} ${vazir.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: dirScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <LanguageProvider>
            <Navbar />
            <main className="relative">{children}</main>
            <Footer />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
