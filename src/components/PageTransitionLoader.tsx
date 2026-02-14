"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Spinner } from "./ui/Spinner";

export function PageTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Reset loading state when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Listen for link clicks to show loader
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (link && link.href && !link.href.startsWith("#") && link.target !== "_blank") {
        const url = new URL(link.href);
        // Only show loader if navigating to a different page
        if (url.pathname !== window.location.pathname) {
          setIsLoading(true);
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 w-full bg-primary/20">
        <div className="h-full w-1/3 bg-primary animate-pulse" />
      </div>
      <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm border rounded-lg px-6 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <Spinner size="sm" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
}
