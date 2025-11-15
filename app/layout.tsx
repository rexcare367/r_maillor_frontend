import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import AxiosAuthProvider from "@/components/AxiosAuthProvider";
import CookiePolicy from "@/components/CookiePolicy";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Meillor - Coin Collector",
  description: "Discover and collect rare coins with Meillor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AxiosAuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="w-full max-w-7xl xl:px-0 p-6 mx-auto bg-white flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
            <CookiePolicy />
          </AxiosAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
