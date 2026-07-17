export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container-x py-20 md:py-28">
      <span className="eyebrow">Legal</span>
      <h1 className="display mt-4 text-4xl md:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">Last updated: January 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-soft">
        <section>
          <h2 className="font-display text-xl font-bold text-ink">1. What we collect</h2>
          <p className="mt-2">
            Profile details you provide (name, sport, audience stats, rates), account
            credentials, and usage data needed to operate the marketplace.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">2. How we use it</h2>
          <p className="mt-2">
            To match athletes and brands, process payments, and improve search and
            recommendations. We do not sell your data.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">3. Sharing</h2>
          <p className="mt-2">
            Profile information you mark public is visible to other users. Payment details are
            shared only with our payment processor.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">4. Your rights</h2>
          <p className="mt-2">
            You can access, correct, or delete your account data at any time from your
            dashboard, or by contacting support@athlex.app.
          </p>
        </section>
      </div>
    </div>
  );
}
