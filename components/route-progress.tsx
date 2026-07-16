"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        anchor.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey
      )
        return;
      const url = new URL(href, window.location.href);
      if (url.pathname === pathname) return;
      setActive(true);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  if (!active) return null;
  return (
    <div className="fixed left-0 top-0 z-[100] h-0.5 w-full bg-transparent">
      <div className="h-full w-full origin-left animate-route-progress bg-brand" />
    </div>
  );
}
