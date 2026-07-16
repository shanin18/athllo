import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { BadgeCheck, MapPin, Instagram, Youtube } from "lucide-react";
import { getAthleteBySlug } from "@/lib/data/athletes";
import { getCurrentUser } from "@/lib/supabase/server";
import { AthleteCta } from "@/components/marketing/athlete-cta";
import { sportImageUrl } from "@/lib/sport-images";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await getAthleteBySlug(slug);
  return { title: a ? a.name : "Athlete not found" };
}

export default async function AthleteProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await getAthleteBySlug(slug);
  if (!a) notFound();

  const user = await getCurrentUser();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden bg-ink text-white">
          <Image
            src={sportImageUrl(a.sport, 1600)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
          <div className="container-x relative py-14">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
              {a.sport}
            </span>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
              <div className="flex items-center gap-5">
                <Avatar seed={a.slug} size={88} className="border-2 border-white/20" />
                <div>
                <h1 className="display flex items-center gap-3 text-5xl md:text-6xl">
                  {a.name}
                  {a.verified && <BadgeCheck className="h-8 w-8 text-[#7d92ff]" />}
                </h1>
                <p className="mt-3 flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4" /> {a.loc}
                </p>
                <p className="mt-2 max-w-lg text-lg text-white/80">{a.headline}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="stat-num text-5xl font-bold text-[#7d92ff]">{a.reach}</div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                  total reach
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-x grid gap-6 py-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <Card className="p-7">
              <h2 className="font-display text-xl font-bold">About</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{a.bio}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {a.achievements.map((ac: string) => (
                  <Badge key={ac} className="border-brand/20 bg-brand-wash text-brand">
                    {ac}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-7">
              <h2 className="font-display text-xl font-bold">Audience</h2>
              <div className="mt-5 grid grid-cols-3 gap-4">
                {a.stats.map(([platform, count]: [string, string]) => (
                  <div key={platform} className="rounded-xl border border-line p-4">
                    <div className="flex items-center gap-1.5 text-muted">
                      {platform === "Instagram" && <Instagram className="h-3.5 w-3.5" />}
                      {platform === "YouTube" && <Youtube className="h-3.5 w-3.5" />}
                      <span className="font-mono text-[10px] uppercase tracking-widest">
                        {platform}
                      </span>
                    </div>
                    <div className="stat-num mt-2 text-2xl font-bold">{count}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sticky sponsor CTA */}
          <div>
            <Card className="sticky top-24 p-7">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted">Starting rate</span>
                <span className="stat-num text-2xl font-bold">{a.rate}</span>
              </div>
              <p className="mt-1 text-xs text-muted">per campaign · negotiable</p>
              <AthleteCta recipientId={a.userId} athleteName={a.name} isSignedIn={!!user} />
              <p className="mt-4 text-center text-xs text-muted">
                Payments handled securely via Stripe
              </p>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
