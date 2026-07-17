export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container-x py-20 md:py-28">
      <span className="eyebrow">Legal</span>
      <h1 className="display mt-4 text-4xl md:text-5xl">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted">Last updated: January 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-soft">
        <section>
          <h2 className="font-display text-xl font-bold text-ink">1. Using Athlex</h2>
          <p className="mt-2">
            By creating an account, you agree to use Athlex only for legitimate sponsorship
            discovery, negotiation, and payment between athletes and brands.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">2. Accounts</h2>
          <p className="mt-2">
            You're responsible for the accuracy of your profile and for keeping your account
            credentials secure. Athlete audience figures must be truthful.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">3. Payments</h2>
          <p className="mt-2">
            Deals funded through Athlex are processed via our payment provider. Athlex may
            charge a platform fee as disclosed on your plan.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">4. Termination</h2>
          <p className="mt-2">
            We may suspend accounts that violate these terms, misrepresent audience data, or
            engage in fraudulent activity.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">5. Contact</h2>
          <p className="mt-2">Questions about these terms? Reach us at support@athlex.app.</p>
        </section>
      </div>
    </div>
  );
}
