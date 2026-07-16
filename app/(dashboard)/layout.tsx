import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutGrid, User, Inbox, Handshake, Wallet, Search, Megaphone, LogOut, CreditCard } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { Avatar } from "@/components/ui/avatar";
import { DashboardNavLink } from "@/components/dashboard/nav-link";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";

const ATHLETE_NAV = [
  { href: "/athlete", label: "Overview", icon: LayoutGrid },
  { href: "/athlete/profile", label: "My profile", icon: User },
  { href: "/athlete/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/athlete/deals", label: "Deals", icon: Handshake },
  { href: "/athlete/payouts", label: "Payouts", icon: Wallet },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/search", label: "Discover", icon: Search },
];

const SPONSOR_NAV = [
  { href: "/sponsor", label: "Overview", icon: LayoutGrid },
  { href: "/sponsor/profile", label: "Company profile", icon: User },
  { href: "/sponsor/opportunities", label: "Opportunities", icon: Megaphone },
  { href: "/sponsor/deals", label: "Deals", icon: Handshake },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/search", label: "Discover", icon: Search },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth guard — middleware also protects, this is defense in depth.
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  const { user, role } = profile;
  const NAV = role === "sponsor" ? SPONSOR_NAV : ATHLETE_NAV;

  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[240px_1fr]">
      <MobileSidebar
        nav={NAV.map((n) => ({ href: n.href, label: n.label, icon: <n.icon className="h-4 w-4" /> }))}
        email={user.email ?? ""}
        role={role}
      />

      <aside className="hidden border-r border-line bg-surface md:flex md:flex-col">
        <Link href="/" className="flex h-16 items-center gap-2 border-b border-line px-6">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-panel text-white font-display font-extrabold text-sm">
            P
          </span>
          <span className="font-display text-lg font-extrabold">Podium</span>
        </Link>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((n) => (
            <DashboardNavLink key={n.label} href={n.href} icon={<n.icon className="h-4 w-4" />}>
              {n.label}
            </DashboardNavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3 border-t border-line p-4">
          <Avatar seed={user.email ?? user.id} size={32} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-ink-soft">{user.email}</div>
            <div className="text-[11px] capitalize text-muted">{role}</div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              title="Log out"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-wash hover:text-brand"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </aside>
      <main className="bg-bg">{children}</main>
    </div>
  );
}
