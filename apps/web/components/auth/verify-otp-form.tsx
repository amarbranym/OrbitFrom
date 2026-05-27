"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  OTP_EXPIRY_MS,
  OTP_RESEND_COOLDOWN_MS,
  type OtpPurpose,
} from "@repo/auth/constants";
import { verifyOtpSchema, type VerifyOtpInput } from "@repo/auth/schemas";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { trpc } from "~/trpc/client";

function formatSeconds(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type VerifyOtpFormProps = {
  email: string;
  purpose: OtpPurpose;
  fullName?: string;
  initialExpiresAt?: string;
  redirectTo?: string;
};

export function VerifyOtpForm({
  email,
  purpose,
  fullName,
  initialExpiresAt,
  redirectTo = "/dashboard",
}: VerifyOtpFormProps) {
  const utils = trpc.useUtils();

  const [resendSeconds, setResendSeconds] = useState(
    Math.ceil(OTP_RESEND_COOLDOWN_MS / 1000),
  );
  const [expiresAt, setExpiresAt] = useState<Date | null>(() => {
    if (initialExpiresAt) return new Date(initialExpiresAt);
    return new Date(Date.now() + OTP_EXPIRY_MS);
  });
  const [expirySeconds, setExpirySeconds] = useState(OTP_EXPIRY_MS / 1000);

  const verifySignup = trpc.auth.verifySignupOtp.useMutation();
  const verifyLogin = trpc.auth.verifyLoginOtp.useMutation();
  const resendOtp = trpc.auth.resendOtp.useMutation();

  const form = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email,
      code: "",
      purpose,
      fullName,
    },
  });

  useEffect(() => {
    form.setValue("email", email);
    form.setValue("purpose", purpose);
    if (fullName) form.setValue("fullName", fullName);
  }, [email, purpose, fullName, form]);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = setInterval(() => {
      setResendSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendSeconds]);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((expiresAt.getTime() - Date.now()) / 1000),
      );
      setExpirySeconds(remaining);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const isExpired = expirySeconds <= 0;
  const isPending = verifySignup.isPending || verifyLogin.isPending;

  const backHref = purpose === "signup" ? "/signup" : "/login";

  const onSubmit = form.handleSubmit(async (values) => {
    if (isExpired) {
      toast.error("Code expired", { description: "Request a new verification code." });
      return;
    }

    try {
      if (purpose === "signup") {
        await verifySignup.mutateAsync(values);
      } else {
        await verifyLogin.mutateAsync(values);
      }
      await utils.auth.getSession.invalidate();
      toast.success(purpose === "signup" ? "Account created" : "Signed in");
      const destination =
        redirectTo.startsWith("/") && !redirectTo.startsWith("//")
          ? redirectTo
          : "/dashboard";
      // Use a hard navigation so the next request always includes freshly set
      // auth cookies from the OTP verification response.
      window.location.assign(destination);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed";
      toast.error(message);
    }
  });

  const handleResend = useCallback(async () => {
    if (resendSeconds > 0) return;

    try {
      const result = await resendOtp.mutateAsync({
        email,
        purpose,
        fullName: purpose === "signup" ? fullName : undefined,
      });
      setExpiresAt(new Date(result.expiresAt));
      setResendSeconds(Math.ceil(OTP_RESEND_COOLDOWN_MS / 1000));
      form.setValue("code", "");
      toast.success("New code sent");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not resend code";
      toast.error(message);
      if (message.includes("resend")) {
        const match = message.match(/(\d+)\s+seconds/);
        if (match?.[1]) setResendSeconds(Number(match[1]));
      }
    }
  }, [resendSeconds, resendOtp, email, purpose, fullName, form]);

  const purposeLabel = useMemo(
    () => (purpose === "signup" ? "complete sign up" : "sign in"),
    [purpose],
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="rounded-lg bg-muted/50 px-4 py-3 text-center text-sm">
          <p className="text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isExpired ? (
              <span className="text-destructive">Code expired — request a new one</span>
            ) : (
              <>Expires in {formatSeconds(expirySeconds)}</>
            )}
          </p>
        </div>

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel className="sr-only">Verification code</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isExpired || isPending}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} className="size-11 text-lg" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending || isExpired}>
          {isPending ? (
            <>
              <IconLoader2 className="size-4 animate-spin" />
              Verifying…
            </>
          ) : (
            `Verify and ${purposeLabel}`
          )}
        </Button>

        <div className="flex flex-col items-center gap-2 text-sm">
          <Button
            type="button"
            variant="ghost"
            className="text-primary"
            disabled={resendSeconds > 0 || resendOtp.isPending}
            onClick={() => void handleResend()}
          >
            {resendOtp.isPending ? (
              <>
                <IconLoader2 className="size-4 animate-spin" />
                Sending…
              </>
            ) : resendSeconds > 0 ? (
              `Resend code in ${resendSeconds}s`
            ) : (
              "Resend verification code"
            )}
          </Button>
          <Link href={backHref} className="text-muted-foreground hover:text-foreground">
            Use a different email
          </Link>
        </div>
      </form>
    </Form>
  );
}
