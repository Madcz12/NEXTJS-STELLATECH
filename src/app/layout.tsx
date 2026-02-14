import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { PageTransitionLoader } from "@/components/PageTransitionLoader";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";

import { AuthProvider } from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STELLA.TECH - Premium Tech E-commerce",
  description: "Your source for gaming laptops, components, and peripherals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ReduxProvider>
              <PageTransitionLoader />
              <ConditionalLayout header={<Header />}>
                {children}
              </ConditionalLayout>
              <Toaster />
            </ReduxProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
