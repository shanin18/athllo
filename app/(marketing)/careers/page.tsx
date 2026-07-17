import { Card } from "@/components/ui/card";

export const metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <div className="container-x py-20 md:py-28">
      <div className="max-w-2xl">
        <span className="eyebrow">Careers</span>
        <h1 className="display mt-4 text-4xl md:text-6xl">Help build the future of sponsorship.</h1>
        <p className="mt-4 text-muted">
          We're a small, remote team obsessed with making sponsorship fair and direct.
        </p>
      </div>
      <Card className="mt-14 p-10 text-center">
        <p className="text-sm font-medium text-ink">We don't have any open positions right now.</p>
        <p className="mt-1 text-sm text-muted">Check back soon, or reach out to say hello.</p>
      </Card>
    </div>
  );
}
