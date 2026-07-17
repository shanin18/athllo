import { Card } from "@/components/ui/card";
import { HeroMedia } from "@/components/marketing/hero-media";
import { sportImageUrl } from "@/lib/sport-images";

export const metadata = { title: "About" };

const VALUES = [
  { title: "Merit over marketing", body: "Reach is verified, not self-reported. Brands see real numbers." },
  { title: "Direct relationships", body: "No agents, no middlemen — athletes and brands deal directly." },
  { title: "Built for the long game", body: "Tools for repeat deals, not one-off transactions." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-panel text-white">
        <HeroMedia src={sportImageUrl("Climbing", 1800)} opacity={30} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-panel via-panel/80 to-panel/50" />
        <div className="container-x relative py-24 md:py-32">
          <h1 className="display max-w-2xl text-5xl md:text-6xl">Built by people who love sport.</h1>
          <p className="mt-5 max-w-lg text-lg text-white/70">
            Athlex exists to connect athletes with the brands that should be backing them —
            without the noise of agencies and cold DMs.
          </p>
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map((v) => (
            <Card key={v.title} className="p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
              <h3 className="font-display text-xl font-bold">{v.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{v.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
