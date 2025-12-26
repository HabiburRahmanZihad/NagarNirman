"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Loading } from "../common";


export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Defer setLoading to avoid synchronous setState inside effect
    const startDelay = setTimeout(() => setLoading(true), 0);

    // small delay to simulate page loading
    const endDelay = setTimeout(() => setLoading(false), 500);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(endDelay);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-9999">
      <Loading></Loading>
    </div>
  );
}
