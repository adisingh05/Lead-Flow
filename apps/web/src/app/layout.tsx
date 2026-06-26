import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeadFlow AI — AI-Native Lead Generation",
  description:
    "Find leads, close deals, on autopilot. AI-native outbound lead generation built for Indian startups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full`}>
        <body className="min-h-full flex flex-col bg-[#FAFAF9] text-[#0F0F0F] antialiased font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
