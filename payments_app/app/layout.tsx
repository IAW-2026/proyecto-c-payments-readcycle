import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "../styles/globals.css";
import AuthButtons from "../components/ui/AuthButtons";
import { ToastAndModalProvider } from "@/components/ui/ToastAndModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReadCycle - Pagos y Denuncias",
  description: "Plataforma de administración de pagos y disputas para ReadCycle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-beige text-zinc-900 selection:bg-brand-sage/20">
        <ClerkProvider>
          <ToastAndModalProvider>
            <header className="w-full border-b border-brand-sand/40 bg-brand-beige/70 backdrop-blur-md sticky top-0 z-50 transition-all">
              <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 h-16">
                <Link href="/" className="transition-opacity hover:opacity-90 flex items-center gap-2">
                  <Image
                    src="/e71ac032-2a49-4210-88e3-a2ea411acb84-removebg-preview.png"
                    alt="ReadCycle Logo"
                    width={180}
                    height={45}
                    priority
                    className="h-11 sm:h-12 w-auto object-contain"
                  />
                </Link>
                <AuthButtons />
              </div>
            </header>
            {children}
          </ToastAndModalProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
