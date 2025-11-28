"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loader from "./Loader";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // start loader on route change
    setLoading(true);

    // small delay to simulate page loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-[9999]">
      <Loader></Loader>
    </div>
  );
}
