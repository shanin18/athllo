"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardNavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOverview = href === "/athlete" || href === "/sponsor" || href === "/search";
  const active = isOverview ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-wash hover:text-brand",
        active ? "bg-brand-wash text-brand" : "text-ink-soft"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
