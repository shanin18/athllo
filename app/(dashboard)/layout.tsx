import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutGrid, User, Inbox, Handshake, Wallet, Search, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const ATHLETE_NAV = [
  { href: "/athlete", label: "Overview", icon: LayoutGrid },
  { href: "/athlete#profile", label: "My profile", icon: User },
  { href: "/athlete#inquiries", label: "Inquiries", icon: Inbox },
  { href: "/athlete#deals", label: "Deals", icon: Handshake },
  { href: "/athlete#payouts", label: "Payouts", icon: Wallet },
  { href: "/search", label: "Discover", icon: Search },
];

const SPONSOR_NAV = [
  { href: "/sponsor", label: "Overview", icon: LayoutGrid },
  { href: "/sponsor#opportunities", label: "Opportunities", icon: Megaphone },
  { href: "/sponsor#deals", label: "Deals", icon: Handshake },
  { href: "/search", label: "Discover", icon: Search },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth guard — middleware also protects, this is defense in depth.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const NAV = profile?.role === "sponsor" ? SPONSOR_NAV : ATHLETE_NAV;

  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-line bg-surface md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-line px-6">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-ink text-white font-display font-extrabold text-sm">
            A
          </span>
          <span className="font-display text-lg font-extrabold">Athllo</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-wash hover:text-brand"
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          <div className="truncate text-xs text-muted">{user.email}</div>
        </div>
      </aside>
      <main className="bg-bg">{children}</main>
    </div>
  );
}
