import Link from "next/link";

export function SiteFooter() {
  const cols = [
    {
      title: "Platform",
      links: [
        { href: "/search", label: "Discover athletes" },
        { href: "/signup", label: "For brands" },
        { href: "/signup", label: "For athletes" },
        { href: "/pricing", label: "Pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/#about", label: "About" },
        { href: "/#contact", label: "Contact" },
        { href: "/pricing", label: "Careers" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/#terms", label: "Terms" },
        { href: "/#privacy", label: "Privacy" },
      ],
    },
  ];
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-panel text-white font-display font-extrabold text-sm">
              P
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              Podium
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            The marketplace where athletes and brands find each other — and get deals done.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="eyebrow mb-4">{c.title}</p>
            <ul className="space-y-3">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Podium. All rights reserved.</span>
          <span className="font-mono uppercase tracking-widest">Built for athletes</span>
        </div>
      </div>
    </footer>
  );
}
