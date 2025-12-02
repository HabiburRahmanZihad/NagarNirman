"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      <header className="sticky z-99999 top-0">
        {!isDashboard && <Navbar />}
      </header>
      <main>
        {children}
      </main>
      <footer>
        {!isDashboard && <Footer/>}
      </footer>
    </>
  );
}
