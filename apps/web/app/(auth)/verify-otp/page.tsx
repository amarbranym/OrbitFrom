import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthShell } from "~/components/auth/auth-shell";
import { VerifyOtpForm } from "~/components/auth/verify-otp-form";
import type { OtpPurpose } from "@repo/auth/constants";
import { OTP_PURPOSES } from "@repo/auth/constants";

type PageProps = {
  searchParams: Promise<{
    email?: string;
    purpose?: string;
    fullName?: string;
    expiresAt?: string;
    next?: string;
  }>;
};

export default async function VerifyOtpPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const email = params.email?.trim().toLowerCase();
  const purpose = params.purpose as OtpPurpose | undefined;
  const fullName = params.fullName?.trim();

  if (!email || !purpose || !OTP_PURPOSES.includes(purpose)) {
    redirect("/login");
  }

  if (purpose === "signup" && !fullName) {
    redirect("/signup");
  }

  return (
    <AuthShell
      title="Verify your email"
      description="Enter the 6-digit code we sent you. It expires in 5 minutes."
      footer={
        <Link href={purpose === "signup" ? "/signup" : "/login"} className="text-primary hover:underline">
          Back
        </Link>
      }
    >
      <VerifyOtpForm
        email={email}
        purpose={purpose}
        fullName={purpose === "signup" ? fullName : undefined}
        initialExpiresAt={params.expiresAt}
        redirectTo={params.next}
      />
    </AuthShell>
  );
}
