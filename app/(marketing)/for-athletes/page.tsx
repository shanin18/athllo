import Link from "next/link";
import { ArrowRight, BadgeCheck, Wallet, LineChart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroMedia } from "@/components/marketing/hero-media";
import { sportImageUrl } from "@/lib/sport-images";

export const metadata = { title: "For athletes" };

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Get verified",
    body: "Prove your reach with a verification badge that brands trust — no more screenshotting analytics.",
  },
  {
    icon: Wallet,
    title: "Set your own rate",
    body: "You decide the price per campaign. Negotiate directly with brands, keep more of every deal.",
  },
  {
    icon: LineChart,
    title: "Track performance",
    body: "See profile views, inquiry volume, and deal history from one dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Get paid securely",
    body: "Funds are held via Stripe until the deal is complete — no chasing invoices.",
  },
];

export default function ForAthletesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-panel text-white">
        <HeroMedia src={sportImageUrl("Surfing", 1800)} video="/videos/surfing_slowmo.mp4" opacity={32} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-panel via-panel/80 to-panel/50" />
        <div className="container-x relative py-24 md:py-32">
          <Badge className="border-brand/30 bg-white/10 text-white">For athletes</Badge>
          <h1 className="display mt-5 max-w-2xl text-5xl md:text-6xl">
            Turn your reach into revenue.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-white/70">
            Build a profile that proves your value, get verified, and let brands come to you.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg">
              Create your profile <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <div className="grid gap-5 md:grid-cols-2">
          {BENEFITS.map((b) => (
            <Card key={b.title} className="group p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-wash text-brand transition-transform duration-200 group-hover:scale-110">
                <b.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">{b.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{b.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-panel px-8 py-16 text-center text-white md:py-20">
          <HeroMedia src={sportImageUrl("Surfing", 1600)} opacity={20} />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-panel via-panel/80 to-panel/60" />
          <div className="relative">
            <h2 className="display mx-auto max-w-xl text-4xl md:text-5xl">
              Your next sponsor is searching right now.
            </h2>
            <Link href="/signup" className="mt-8 inline-block">
              <Button size="lg">Claim your profile</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
