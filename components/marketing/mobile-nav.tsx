"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { NavLinks } from "@/components/marketing/nav-links";

export function MobileNav({
  links,
  isSignedIn,
  dashboardHref,
}: {
  links: { href: string; label: string }[];
  isSignedIn: boolean;
  dashboardHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-brand-wash hover:text-brand"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={`fixed inset-0 z-[60] bg-panel/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          className={`ml-auto flex h-full w-72 flex-col bg-surface p-6 shadow-lift transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-extrabold">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-brand-wash hover:text-brand"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-1">
              <NavLinks
                links={links}
                onNavigate={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-brand-wash hover:text-brand"
                activeClassName="bg-brand-wash text-brand"
                inactiveClassName="text-ink-soft"
              />
            </nav>

            <div className="mt-auto flex flex-col gap-2 pt-6">
              {isSignedIn ? (
                <>
                  <Link href={dashboardHref} onClick={() => setOpen(false)}>
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-sm font-medium text-ink-soft hover:bg-brand-wash hover:text-brand"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full">Get started</Button>
                  </Link>
                </>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
