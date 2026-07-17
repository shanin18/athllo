"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { DashboardNavLink } from "@/components/dashboard/nav-link";
import { signOut } from "@/lib/actions/auth";

export function MobileSidebar({
  nav,
  email,
  role,
}: {
  nav: { href: string; label: string; icon: React.ReactNode }[];
  email: string;
  role: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="flex h-14 items-center justify-between border-b border-line bg-surface px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-panel text-white font-display font-extrabold text-sm">
            A
          </span>
          <span className="font-display text-lg font-extrabold">Athlex</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-brand-wash hover:text-brand"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-panel/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          className={`flex h-full w-72 flex-col bg-surface p-4 shadow-lift transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between px-2 py-2">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <span className="grid h-7 w-7 place-items-center rounded-md bg-panel text-white font-display font-extrabold text-sm">
                  A
                </span>
                <span className="font-display text-lg font-extrabold">Athlex</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-brand-wash hover:text-brand"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-4 flex-1 space-y-1">
              {nav.map((n) => (
                <div key={n.label} onClick={() => setOpen(false)}>
                  <DashboardNavLink href={n.href} icon={n.icon}>
                    {n.label}
                  </DashboardNavLink>
                </div>
              ))}
            </nav>

            <div className="border-t border-line p-2 pt-4">
              <div className="truncate text-xs font-medium text-ink-soft">{email}</div>
              <div className="text-[11px] capitalize text-muted">{role}</div>
              <form action={signOut} className="mt-3">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-sm font-medium text-ink-soft hover:bg-brand-wash hover:text-brand"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
}
