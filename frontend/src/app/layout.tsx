import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import ClientLayout from "@/components/common/ClientLayout";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "NagarNirman - Report. Resolve. Rebuild.",
  description: "Citizen-powered platform for reporting and tracking public infrastructure issues in Bangladesh",
  keywords: ["Bangladesh", "Infrastructure", "City Management", "SDG 11", "Citizen Reports"],
  icons: {
    icon: "/favicon.png",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Toaster position="top-right" />
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
