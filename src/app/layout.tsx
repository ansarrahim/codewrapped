import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MotionRoot from "@/components/MotionRoot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://codewrapped.vercel.app";
const TITLE = "CodeWrapped — your GitHub year, wrapped";
const DESCRIPTION =
  "Enter any GitHub username and get a shareable, animated wrap of their coding year — top languages, longest streak, most active repo, and a personality label pulled from real data.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | CodeWrapped" },
  description: DESCRIPTION,
  keywords: [
    "GitHub wrapped",
    "coding year in review",
    "GitHub stats",
    "developer personality",
    "GitHub contribution graph",
  ],
  authors: [{ name: "Muhammad Ansar" }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "CodeWrapped",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-full flex-col bg-[#0d0221] text-[#f5f3ff]">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition-transform focus-visible:translate-y-0"
        >
          Skip to main content
        </a>
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
