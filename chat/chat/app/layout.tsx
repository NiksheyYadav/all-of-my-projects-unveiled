import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlowMind - AI-Powered Productivity Tool",
  description: "Enhance your workflow efficiency with intelligent task automation and real-time collaboration. Available on Android with seamless cross-platform synchronization.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Android App Linking */}
        <meta name="google-play-app" content="app-id=com.aichat.app" />
        {/* Smart App Banner */}
        <meta name="format-detection" content="telephone=no" />
        {/* Mobile viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* Theme color for Android */}
        <meta name="theme-color" content="#0f0c29" />
        {/* App name */}
        <meta name="application-name" content="FlowMind" />
        {/* Mobile optimized */}
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 to-gray-950 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
