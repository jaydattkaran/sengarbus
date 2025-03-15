"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname(); // Detect route changes

  useEffect(() => {
    setLoading(true); // Show loader
    const timer = setTimeout(() => setLoading(false), 1000); // Minimum 1 sec

    return () => clearTimeout(timer);
  }, [pathname]); // Runs every time pathname changes

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
        </div>
      )}
      {children}
    </>
  );
}