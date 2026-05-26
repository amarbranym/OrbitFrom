"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signupEmailSchema, type SignupEmailInput } from "@repo/auth/schemas";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { trpc } from "~/trpc/client";

export function SignupForm() {
  const router = useRouter();
  const sendOtp = trpc.auth.sendSignupOtp.useMutation();

  const form = useForm<SignupEmailInput>({
    resolver: zodResolver(signupEmailSchema),
    defaultValues: { fullName: "", email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await sendOtp.mutateAsync(values);
      const params = new URLSearchParams({
        email: values.email,
        purpose: "signup",
        fullName: values.fullName,
        expiresAt: result.expiresAt,
      });
      toast.success("Verification code sent", {
        description: "Check your inbox for the 6-digit code.",
      });
      router.push(`/verify-otp?${params.toString()}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not send verification code";
      toast.error(message);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={sendOtp.isPending}>
          {sendOtp.isPending ? (
            <>
              <IconLoader2 className="size-4 animate-spin" />
              Sending code…
            </>
          ) : (
            "Send verification code"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
}
