import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/components/providers/RootProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SUTRA | Unified Governance Intelligence",
  description:
    "Cross-Ministry Governance & Impact Intelligence Platform connecting programmes, resources, regions and outcomes.",
  keywords: [
    "SUTRA",
    "Governance Intelligence",
    "Cross-Ministry",
    "Scheme Intelligence",
    "Public Policy Analytics",
    "Outcome Intelligence",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-blue-100 selection:text-blue-900">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
