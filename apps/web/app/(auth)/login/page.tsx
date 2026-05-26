import { Suspense } from "react";

import { AuthShell } from "~/components/auth/auth-shell";
import { LoginForm } from "~/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in with a one-time code sent to your email."
    >
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
