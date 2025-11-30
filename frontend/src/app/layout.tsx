import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { Toaster } from "react-hot-toast";
import ClientLayout from "@/components/common/ClientLayout";
import RouteLoader from "@/components/Loader/RouteLoader";
import Script from "next/script";

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
          <NotificationProvider>
            <Toaster position="top-right" />
            <ClientLayout>
              <RouteLoader></RouteLoader>
              {children}
            </ClientLayout>
          </NotificationProvider>
        </AuthProvider>
        <Script id="chatbase-init">
          {`
            (function(){
              if(!window.chatbase || window.chatbase("getState") !== "initialized"){
                window.chatbase = (...arguments) => {
                  if(!window.chatbase.q){ window.chatbase.q = [] }
                  window.chatbase.q.push(arguments)
                };
                window.chatbase = new Proxy(window.chatbase, {
                  get(target, prop){
                    if(prop === "q"){ return target.q }
                    return (...args) => target(prop, ...args)
                  }
                })
              }

              const onLoad = function(){
                const script = document.createElement("script");
                script.src = "https://www.chatbase.co/embed.min.js";
                script.id = "00qD6o1rqtCEbkpgPyOFW";
                script.domain = "www.chatbase.co";
                document.body.appendChild(script)
              };

              if(document.readyState === "complete"){ onLoad() }
              else { window.addEventListener("load", onLoad) }
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
