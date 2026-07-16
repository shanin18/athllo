import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { MobileNav } from "@/components/marketing/mobile-nav";
import { LogOut } from "lucide-react";

export async function SiteNav() {
  const profile = await getCurrentProfile();
  const dashboardHref = profile?.role === "sponsor" ? "/sponsor" : "/athlete";

  const links = [
    { href: "/search", label: "Discover" },
    { href: "/for-athletes", label: "For athletes" },
    { href: "/for-brands", label: "For brands" },
    { href: "/pricing", label: "Pricing" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface shadow-sm">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-panel text-white font-display font-extrabold text-sm">
            P
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            Podium
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {profile ? (
              <>
                <Link href={dashboardHref}>
                  <Button size="sm">Dashboard</Button>
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    title="Log out"
                    className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-brand-wash hover:text-brand"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>
          <MobileNav links={links} isSignedIn={!!profile} dashboardHref={dashboardHref} />
        </div>
      </div>
    </header>
  );
}
