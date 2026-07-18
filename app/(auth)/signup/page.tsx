"use client";

import { Suspense, useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { signUpWithCustomEmail, type SignUpActionState } from "@/lib/actions/signup";

const initialState: SignUpActionState = { ok: false, message: "" };

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const [role, setRole] = useState<"athlete" | "sponsor">("athlete");
  const [email, setEmail] = useState("");
  const [state, formAction, pending] = useActionState(signUpWithCustomEmail, initialState);

  if (state.needsConfirmation) {
    return (
      <div>
        <h1 className="font-display text-3xl font-extrabold">Check your email</h1>
        <p className="mt-3 text-sm text-muted">
          We've sent a confirmation link to <span className="font-medium text-ink">{email}</span>.
          Click it to activate your account, then log in.
        </p>
        <Link href="/login" className="mt-6 inline-block">
          <Button variant="outline">Go to login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Create your account</h1>
      <p className="mt-2 text-sm text-muted">Join Athlex in under a minute.</p>

      <div className="mt-7 grid grid-cols-2 gap-2 rounded-xl bg-black/[0.03] p-1">
        {(["athlete", "sponsor"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={cn(
              "h-10 rounded-lg text-sm font-medium capitalize transition-all",
              role === r ? "bg-surface text-ink shadow-card" : "text-muted"
            )}
          >
            I'm {r === "athlete" ? "an athlete" : "a brand"}
          </button>
        ))}
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="role" value={role} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft">Email</label>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-soft">Password</label>
          <PasswordInput
            name="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
        </div>
        {state.message && !state.ok && <p className="text-sm text-energy">{state.message}</p>}
        <Button type="submit" className="w-full" loading={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:text-brand-ink">
          Log in
        </Link>
      </p>
    </div>
  );
}
