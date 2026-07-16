import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, ShieldCheck, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sportImageUrl } from "@/lib/sport-images";

export const metadata = { title: "For brands" };

const BENEFITS = [
  {
    icon: Search,
    title: "Search on merit",
    body: "Filter by sport, location, budget, and real audience reach — not who you already know.",
  },
  {
    icon: ShieldCheck,
    title: "Verified athletes",
    body: "Every verified badge means we've checked the audience numbers behind it.",
  },
  {
    icon: MessagesSquare,
    title: "Direct conversations",
    body: "Message athletes directly, negotiate terms, no agency mark-up.",
  },
];

export default function ForBrandsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-panel text-white">
        <Image
          src={sportImageUrl("Basketball", 1800)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-panel via-panel/80 to-panel/50" />
        <div className="container-x relative py-24 md:py-32">
          <Badge className="border-energy/30 bg-white/10 text-white">For brands</Badge>
          <h1 className="display mt-5 max-w-2xl text-5xl md:text-6xl">
            Find talent that actually fits.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-white/70">
            Search verified athletes by sport, audience, and budget — and pay securely, all in
            one place.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/signup">
              <Button size="lg">
                Start sponsoring <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                Browse athletes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <div className="grid gap-5 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <Card key={b.title} className="p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-wash text-brand">
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
          <div className="relative">
            <h2 className="display mx-auto max-w-xl text-4xl md:text-5xl">
              Your next campaign starts with the right athlete.
            </h2>
            <Link href="/signup" className="mt-8 inline-block">
              <Button size="lg">Get started free</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
