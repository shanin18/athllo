"use client";

import { Suspense, useActionState, useState } from "react";
import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { signUpWithCustomEmail, resendConfirmationEmail, type SignUpActionState } from "@/lib/actions/signup";
import { GoogleButton } from "@/components/auth/google-button";

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
  const [resendState, setResendState] = useState<{ loading: boolean; message: string | null }>({
    loading: false,
    message: null,
  });

  async function handleResend() {
    setResendState({ loading: true, message: null });
    const res = await resendConfirmationEmail(email);
    setResendState({ loading: false, message: res.message });
  }

  if (state.needsConfirmation) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center shadow-card">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-wash">
          <Mail className="h-7 w-7 text-brand" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-extrabold text-ink">Check your email</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          We've sent a confirmation link to{" "}
          <span className="font-medium text-ink">{email}</span> to verify your address. Open it
          and click the link to activate your account.
        </p>

        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
          <p className="text-xs leading-relaxed text-amber-800">
            <span className="font-semibold">Tip:</span> the email sometimes lands in your Spam or
            Promotions folder. If you don't see it in your inbox within a minute, check there and
            mark it "Not spam" so future emails arrive normally.
          </p>
        </div>

        <div className="my-6 h-px bg-line" />

        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-muted">
            Don't see it? Check your spam folder, or
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendState.loading}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-ink disabled:opacity-60"
          >
            {resendState.loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Resend confirmation email
          </button>
          {resendState.message && <p className="text-xs text-muted">{resendState.message}</p>}
        </div>

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

      <div className="mt-7">
        <GoogleButton />
      </div>
      <div className="my-5 flex items-center gap-3 text-xs text-muted">
        <div className="h-px flex-1 bg-line" />
        or
        <div className="h-px flex-1 bg-line" />
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/[0.03] p-1">
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
