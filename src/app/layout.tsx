import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "NagarNirman - Report. Resolve. Rebuild.",
  description: "Citizen-powered platform for reporting and tracking public infrastructure issues in Bangladesh",
  keywords: ["Bangladesh", "Infrastructure", "City Management", "SDG 11", "Citizen Reports"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
