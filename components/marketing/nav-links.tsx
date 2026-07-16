"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks({
  links,
  onNavigate,
  className,
  activeClassName = "text-brand",
  inactiveClassName = "text-ink-soft hover:text-ink",
}: {
  links: { href: string; label: string }[];
  onNavigate?: () => void;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}) {
  const pathname = usePathname();

  return (
    <>
      {links.map((l) => {
        const active = pathname === l.href || pathname?.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className={`${className ?? ""} transition-colors ${active ? activeClassName : inactiveClassName}`}
          >
            {l.label}
          </Link>
        );
      })}
    </>
  );
}
