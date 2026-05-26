import { SignupForm } from "~/components/auth/signup-form";
import { AuthShell } from "~/components/auth/auth-shell";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Enter your details and we'll email you a verification code."
    >
      <SignupForm />
    </AuthShell>
  );
}
