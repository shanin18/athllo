"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signInSchema } from "@/lib/validation/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEMO_CREDENTIALS = { email: "demo@athllo.test", password: "demo1234" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function fillDemoCredentials() {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.push(next && next.startsWith("/") ? next : "/athlete");
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Log in to your Podium account.</p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-ink-soft">Password</label>
            <Link href="/login" className="text-xs text-brand hover:text-brand-ink">
              Forgot?
            </Link>
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-energy">{error}</p>}
        <Button type="submit" className="w-full" loading={loading}>
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New to Podium?{" "}
        <Link href="/signup" className="font-medium text-brand hover:text-brand-ink">
          Create an account
        </Link>
      </p>

      {process.env.NODE_ENV !== "production" && (
        <div className="mt-6 rounded-xl border border-dashed border-line bg-brand-wash/40 p-4 text-xs">
          <p className="font-medium text-ink-soft">Demo credentials</p>
          <p className="mt-1 text-muted">
            {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
          </p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="mt-2 font-medium text-brand hover:text-brand-ink"
          >
            Fill in
          </button>
        </div>
      )}
    </div>
  );
}
