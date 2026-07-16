import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-panel p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="absolute -left-20 top-1/3 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #1b39ff, transparent 70%)" }}
        />
        <Link href="/" className="relative flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-white text-panel font-display font-extrabold">
            P
          </span>
          <span className="font-display text-xl font-extrabold">Podium</span>
        </Link>
        <div className="relative">
          <h2 className="display text-4xl leading-tight">
            Every athlete has a number.
            <br />
            We put a brand behind it.
          </h2>
          <p className="mt-4 max-w-sm text-white/50">
            Join the marketplace connecting athletes with the brands that want them.
          </p>
        </div>
        <div className="relative flex gap-8 font-mono text-xs uppercase tracking-widest text-white/40">
          <span>14,208 athletes</span>
          <span>9,300 brands</span>
          <span>$4.6M deals</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
