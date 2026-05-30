import type { Metadata } from "next";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "../styles/globals.css";

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
              <div className="flex items-center gap-4">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="text-zinc-600 hover:text-brand-forest font-medium text-sm transition-colors cursor-pointer px-4 py-2 rounded-full hover:bg-brand-sand/40">
                      Iniciar Sesión
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-brand-forest text-brand-beige hover:bg-brand-sage rounded-full font-medium text-sm h-11 px-6 cursor-pointer transition-all shadow-sm hover:shadow active:scale-95">
                      Registrarse
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
