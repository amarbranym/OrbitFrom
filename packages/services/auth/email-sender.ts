import { sendPlainEmail } from "../email/transport";

type SendOtpEmailParams = {
  to: string;
  code: string;
  purpose: "signup" | "login";
  expiresInMinutes: number;
};

export async function sendOtpEmail({
  to,
  code,
  purpose,
  expiresInMinutes,
}: SendOtpEmailParams): Promise<void> {
  const subject =
    purpose === "signup"
      ? "Verify your OrbitForm account"
      : "Your OrbitForm sign-in code";
  const text = [
    `Your OrbitForm verification code is: ${code}`,
    "",
    `This code expires in ${expiresInMinutes} minutes.`,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  await sendPlainEmail({ to, subject, text, logTag: `auth:otp:${purpose}` });
}
