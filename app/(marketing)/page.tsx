import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Search, Wallet, Zap, ShieldCheck, LineChart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StatTicker } from "@/components/marketing/stat-ticker";
import { BrandCarousel } from "@/components/marketing/brand-carousel";
import { CountUp } from "@/components/marketing/count-up";
import { TiltCard } from "@/components/marketing/tilt-card";
import { SportsShowcase } from "@/components/marketing/sports-showcase";
import { HeroMedia } from "@/components/marketing/hero-media";
import { getFeaturedAthletes, getSportCounts } from "@/lib/data/athletes";
import { sportImageUrl } from "@/lib/sport-images";

const SPORTS = ["Surfing", "Track & Field", "Basketball", "Climbing", "Football", "Cycling"];

export const revalidate = 60;

export default async function HomePage() {
  const [FEATURED, sportCounts] = await Promise.all([getFeaturedAthletes(3), getSportCounts()]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-panel text-white">
        <HeroMedia src={sportImageUrl("Track & Field", 1800)} video="/videos/athlet_running.mp4" opacity={28} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-panel/70 via-panel/85 to-panel" />
        <div className="container-x relative grid gap-14 pb-16 pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pb-24 lg:pt-28">
          <div className="animate-fade-up">
            <span className="eyebrow text-white/50">Sports sponsorship, measured</span>
            <h1 className="display mt-5 text-[clamp(2.6rem,6.5vw,5.2rem)]">
              Every athlete has a
              <br />
              number. We put a
              <br />
              <span className="text-[#7d92ff]">brand behind it.</span>
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-white/60">
              Athlex is the marketplace where athletes showcase their real reach and brands
              find, vet, and sponsor the right talent — with secure payments built in.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/signup">
                <Button size="lg">
                  Claim your profile <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  Browse athletes
                </Button>
              </Link>
            </div>
          </div>

          {/* Scoreboard card */}
          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-lift backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                  Live reach index
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#39e08e]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#39e08e]" />
                  updating
                </span>
              </div>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <CountUp value={14208} className="stat-num text-6xl font-bold leading-none" />
                  <div className="mt-2 text-sm text-white/50">verified athletes listed</div>
                </div>
                <div className="text-right">
                  <CountUp
                    value={4.6}
                    prefix="$"
                    suffix="M"
                    decimals={1}
                    className="stat-num text-2xl font-bold text-[#7d92ff]"
                  />
                  <div className="mt-1 text-xs text-white/40">deals facilitated</div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                {[
                  [48, "sports"],
                  [112, "countries"],
                  [9300, "brands"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <CountUp value={n as number} className="stat-num text-lg font-bold" />
                    <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <StatTicker />
      </section>

      {/* HOW IT WORKS */}
      <section className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="eyebrow">How it works</span>
          <h2 className="display mt-4 text-4xl md:text-5xl">
            From discovery to deal, without the middlemen.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Search,
              step: "01",
              title: "Discover on merit",
              body: "Brands filter by sport, location, budget, and real audience reach — not just who they already know.",
            },
            {
              icon: Zap,
              step: "02",
              title: "Connect directly",
              body: "Send an inquiry or post an opportunity. Athletes control their terms and respond on their own time.",
            },
            {
              icon: Wallet,
              step: "03",
              title: "Get paid securely",
              body: "Fund a deal through Stripe. Athletes are paid out on completion — Athlex handles the plumbing.",
            },
          ].map((f) => (
            <Card
              key={f.step}
              className="p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-wash text-brand">
                  <f.icon className="h-5 w-5" />
                </span>
                <span className="stat-num text-sm font-bold text-line">{f.step}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-bold">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FEATURED ATHLETES */}
      {FEATURED.length > 0 && (
        <section className="border-y border-line bg-surface py-20 md:py-28">
          <div className="container-x">
            <div className="flex items-end justify-between">
              <div>
                <span className="eyebrow">Featured talent</span>
                <h2 className="display mt-4 text-4xl md:text-5xl">On the rise this week</h2>
              </div>
              <Link href="/search" className="hidden md:block">
                <Button variant="outline">
                  See all <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURED.map((a) => (
                <Link key={a.slug} href={`/athletes/${a.slug}`}>
                  <TiltCard>
                    <Card className="overflow-hidden transition-shadow hover:shadow-lift">
                      <div className="relative h-44">
                        <Image
                          src={a.coverUrl ?? sportImageUrl(a.sport)}
                          alt={a.sport}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          style={a.coverUrl ? { objectPosition: a.coverPos } : undefined}
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-panel/80 via-panel/10 to-transparent" />
                        <span className="absolute left-4 top-4 font-mono text-[11px] uppercase tracking-widest text-white/70">
                          {a.sport}
                        </span>
                        <div className="absolute bottom-4 left-4">
                          <div className="stat-num text-3xl font-bold text-white">{a.reach}</div>
                          <div className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                            total reach
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2.5">
                          <Avatar seed={a.slug} src={a.avatarUrl} size={28} />
                          <h3 className="font-display text-lg font-bold">{a.name}</h3>
                          {a.verified && <BadgeCheck className="h-4 w-4 text-brand" />}
                        </div>
                        <p className="text-sm text-muted">{a.loc}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                          <span className="stat-num text-sm font-bold">{a.rate}<span className="font-sans font-normal text-muted"> /campaign</span></span>
                          <span className="text-sm font-medium text-brand">View →</span>
                        </div>
                      </div>
                    </Card>
                  </TiltCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SPORTS WE COVER */}
      <section className="container-x py-20 md:py-28">
        <span className="eyebrow">Every sport, one marketplace</span>
        <h2 className="display mt-4 max-w-xl text-4xl md:text-5xl">
          From the surf to the track, brands find talent here.
        </h2>
        <SportsShowcase sports={SPORTS} counts={sportCounts} />
      </section>

      {/* WHY ATHLLO */}
      <section className="border-y border-line bg-surface py-20 md:py-28">
        <div className="container-x">
          <span className="eyebrow">Why Athlex</span>
          <h2 className="display mt-4 max-w-xl text-4xl md:text-5xl">
            Built for real deals, not just discovery.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Verified reach",
                body: "Every athlete's audience numbers are checked before they're marked verified — no vanity metrics.",
              },
              {
                icon: LineChart,
                title: "Deal analytics",
                body: "Track inquiries, response rates, and campaign performance from a single dashboard.",
              },
              {
                icon: Users,
                title: "Direct relationships",
                body: "No agents, no middlemen. Athletes and brands negotiate and communicate directly.",
              },
            ].map((f) => (
              <div key={f.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-wash text-brand">
                  <f.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">{f.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TWO SIDES */}
      <section className="container-x grid gap-5 py-20 md:grid-cols-2 md:py-28">
        <Card className="relative flex flex-col justify-between overflow-hidden p-9">
          <Image
            src={sportImageUrl("Climbing", 900)}
            alt=""
            fill
            sizes="50vw"
            className="object-cover opacity-15"
          />
          <div className="relative">
            <Badge className="border-brand/20 bg-brand-wash text-brand">For athletes</Badge>
            <h2 className="display mt-5 text-3xl md:text-4xl">Turn your reach into revenue.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Build a profile that proves your value, get verified, and let brands come to you.
              Set your rate, control your terms, keep more of every deal.
            </p>
          </div>
          <div className="relative mt-8 flex gap-3">
            <Link href="/signup"><Button>Create profile <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/for-athletes"><Button variant="outline">Learn more</Button></Link>
          </div>
        </Card>
        <Card className="relative flex flex-col justify-between overflow-hidden p-9">
          <Image
            src={sportImageUrl("Basketball", 900)}
            alt=""
            fill
            sizes="50vw"
            className="object-cover opacity-15"
          />
          <div className="relative">
            <Badge className="border-energy/20 bg-energy/10 text-energy">For brands</Badge>
            <h2 className="display mt-5 text-3xl md:text-4xl">Find talent that actually fits.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Search verified athletes by sport, audience, and budget. Vet real reach, start a
              conversation, and pay securely — all in one place.
            </p>
          </div>
          <div className="relative mt-8 flex gap-3">
            <Link href="/signup"><Button variant="ink">Start sponsoring <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/for-brands"><Button variant="outline">Learn more</Button></Link>
          </div>
        </Card>
      </section>

      <BrandCarousel />

      {/* CTA */}
      <section className="container-x pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-panel px-8 py-16 text-center text-white md:py-20">
          <HeroMedia src={sportImageUrl("Cycling", 1600)} opacity={20} />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-panel via-panel/80 to-panel/60" />
          <div className="relative">
            <h2 className="display mx-auto max-w-2xl text-4xl md:text-5xl">
              The next deal is one profile away.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/60">
              Join athletes and brands already building on Athlex.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/signup">
                <Button size="lg">Get started free</Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  See pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
