import { Card } from "@/components/ui/card";
import { Mail, MessageSquare } from "lucide-react";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container-x py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">Contact</span>
        <h1 className="display mt-4 text-4xl md:text-6xl">We'd love to hear from you.</h1>
        <p className="mt-4 text-muted">
          Questions about a deal, a partnership, or the platform — reach out below.
        </p>
      </div>
      <div className="mx-auto mt-14 grid max-w-2xl gap-5 md:grid-cols-2">
        <Card className="p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-wash text-brand">
            <Mail className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-display text-lg font-bold">Email us</h3>
          <p className="mt-1.5 text-sm text-muted">support@athlex.app</p>
        </Card>
        <Card className="p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-wash text-brand">
            <MessageSquare className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-display text-lg font-bold">Live chat</h3>
          <p className="mt-1.5 text-sm text-muted">Available weekdays, 9am–6pm.</p>
        </Card>
      </div>
    </div>
  );
}
