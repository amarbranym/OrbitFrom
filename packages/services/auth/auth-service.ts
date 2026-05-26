import {
  OTP_EXPIRY_MS,
  OTP_MAX_VERIFY_ATTEMPTS,
  OTP_RESEND_COOLDOWN_MS,
  type OtpPurpose,
} from "@repo/auth/constants";
import type {
  LoginEmailInput,
  ResendOtpInput,
  SessionUser,
  SignupEmailInput,
  VerifyOtpInput,
} from "@repo/auth/schemas";
import { db, eq, and, desc } from "@repo/database";
import {
  emailOtpsTable,
  sessionsTable,
  usersTable,
  type SelectUser,
} from "@repo/database/schema";
import type { IncomingMessage, ServerResponse } from "node:http";

import { sendOtpEmail } from "./email-sender";
import { AuthError } from "./errors";
import { generateOtpCode, generateSessionToken, hashToken } from "./crypto";
import {
  clearSessionCookie,
  getSessionTokenFromRequest,
  setSessionCookie,
} from "./cookies";

function toSessionUser(user: SelectUser): SessionUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    emailVerified: user.emailVerified ?? false,
    profileImageUrl: user.profileImageUrl ?? null,
  };
}

export class AuthService {
  private async findUserByEmail(email: string) {
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    return rows[0] ?? null;
  }

  private async deleteOtpsFor(email: string, purpose: OtpPurpose) {
    await db
      .delete(emailOtpsTable)
      .where(and(eq(emailOtpsTable.email, email), eq(emailOtpsTable.purpose, purpose)));
  }

  private async createAndSendOtp(params: {
    email: string;
    purpose: OtpPurpose;
    fullName?: string;
  }) {
    const { email, purpose, fullName } = params;
    const code = generateOtpCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MS);

    await this.deleteOtpsFor(email, purpose);

    await db.insert(emailOtpsTable).values({
      email,
      purpose,
      codeHash: hashToken(code),
      fullName: purpose === "signup" ? fullName : null,
      expiresAt,
      lastSentAt: now,
      attemptCount: 0,
    });

    await sendOtpEmail({
      to: email,
      code,
      purpose,
      expiresInMinutes: OTP_EXPIRY_MS / 60_000,
    });

    return { expiresAt, lastSentAt: now };
  }

  private async getLatestOtp(email: string, purpose: OtpPurpose) {
    const rows = await db
      .select()
      .from(emailOtpsTable)
      .where(and(eq(emailOtpsTable.email, email), eq(emailOtpsTable.purpose, purpose)))
      .orderBy(desc(emailOtpsTable.createdAt))
      .limit(1);
    return rows[0] ?? null;
  }

  private assertResendAllowed(lastSentAt: Date) {
    const elapsed = Date.now() - lastSentAt.getTime();
    if (elapsed < OTP_RESEND_COOLDOWN_MS) {
      const secondsLeft = Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsed) / 1000);
      throw new AuthError(
        `You can resend the code in ${secondsLeft} seconds`,
        "OTP_COOLDOWN",
      );
    }
  }

  async sendSignupOtp(input: SignupEmailInput) {
    const existing = await this.findUserByEmail(input.email);
    if (existing) {
      throw new AuthError("An account with this email already exists", "EMAIL_TAKEN");
    }
    return this.createAndSendOtp({
      email: input.email,
      purpose: "signup",
      fullName: input.fullName,
    });
  }

  async sendLoginOtp(input: LoginEmailInput) {
    const user = await this.findUserByEmail(input.email);
    if (!user) {
      throw new AuthError("No account found with this email", "EMAIL_NOT_FOUND");
    }
    return this.createAndSendOtp({ email: input.email, purpose: "login" });
  }

  async resendOtp(input: ResendOtpInput) {
    const existing = await this.getLatestOtp(input.email, input.purpose);
    if (existing) {
      this.assertResendAllowed(existing.lastSentAt);
    }

    if (input.purpose === "signup") {
      if (!input.fullName) {
        throw new AuthError("Full name is required for sign up", "VALIDATION");
      }
      const taken = await this.findUserByEmail(input.email);
      if (taken) {
        throw new AuthError("An account with this email already exists", "EMAIL_TAKEN");
      }
      return this.createAndSendOtp({
        email: input.email,
        purpose: "signup",
        fullName: input.fullName,
      });
    }

    const user = await this.findUserByEmail(input.email);
    if (!user) {
      throw new AuthError("No account found with this email", "EMAIL_NOT_FOUND");
    }
    return this.createAndSendOtp({ email: input.email, purpose: "login" });
  }

  private async verifyOtpRecord(input: VerifyOtpInput) {
    const otp = await this.getLatestOtp(input.email, input.purpose);
    if (!otp) {
      throw new AuthError("No verification code found. Request a new one.", "OTP_INVALID");
    }

    if (otp.expiresAt.getTime() < Date.now()) {
      await this.deleteOtpsFor(input.email, input.purpose);
      throw new AuthError("This code has expired. Request a new one.", "OTP_EXPIRED");
    }

    if (otp.attemptCount >= OTP_MAX_VERIFY_ATTEMPTS) {
      throw new AuthError("Too many attempts. Request a new code.", "OTP_MAX_ATTEMPTS");
    }

    const demoCode = process.env.DEMO_OTP_CODE;
    const codeHash = hashToken(input.code);
    if (demoCode && input.code === demoCode) {
      return otp;
    }

    if (codeHash !== otp.codeHash) {
      await db
        .update(emailOtpsTable)
        .set({ attemptCount: otp.attemptCount + 1 })
        .where(eq(emailOtpsTable.id, otp.id));
      throw new AuthError("Invalid verification code", "OTP_INVALID");
    }

    return otp;
  }

  private async createSession(userId: string, res: ServerResponse) {
    const token = generateSessionToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(sessionsTable).values({
      userId,
      tokenHash,
      expiresAt,
    });

    setSessionCookie(res, token);
    return token;
  }

  async verifySignupOtp(input: VerifyOtpInput, res: ServerResponse) {
    if (!input.fullName) {
      throw new AuthError("Full name is required", "VALIDATION");
    }

    const existing = await this.findUserByEmail(input.email);
    if (existing) {
      throw new AuthError("An account with this email already exists", "EMAIL_TAKEN");
    }

    await this.verifyOtpRecord(input);

    const [user] = await db
      .insert(usersTable)
      .values({
        email: input.email,
        fullName: input.fullName,
        emailVerified: true,
      })
      .returning();

    if (!user) {
      throw new Error("Failed to create user");
    }

    await this.deleteOtpsFor(input.email, "signup");
    await this.createSession(user.id, res);

    return { user: toSessionUser(user) };
  }

  async verifyLoginOtp(input: VerifyOtpInput, res: ServerResponse) {
    const user = await this.findUserByEmail(input.email);
    if (!user) {
      throw new AuthError("No account found with this email", "EMAIL_NOT_FOUND");
    }

    await this.verifyOtpRecord(input);

    if (!user.emailVerified) {
      await db
        .update(usersTable)
        .set({ emailVerified: true })
        .where(eq(usersTable.id, user.id));
      user.emailVerified = true;
    }

    await this.deleteOtpsFor(input.email, "login");
    await this.createSession(user.id, res);

    return { user: toSessionUser(user) };
  }

  async getSessionFromRequest(req: IncomingMessage): Promise<SessionUser | null> {
    const token = getSessionTokenFromRequest(req);
    if (!token) return null;

    const tokenHash = hashToken(token);
    const sessionRows = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.tokenHash, tokenHash))
      .limit(1);
    const session = sessionRows[0];
    if (!session || session.expiresAt.getTime() < Date.now()) {
      return null;
    }

    const userRows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, session.userId))
      .limit(1);
    const user = userRows[0];
    if (!user) return null;

    return toSessionUser(user);
  }

  async signOut(req: IncomingMessage, res: ServerResponse) {
    const token = getSessionTokenFromRequest(req);
    if (token) {
      const tokenHash = hashToken(token);
      await db.delete(sessionsTable).where(eq(sessionsTable.tokenHash, tokenHash));
    }
    clearSessionCookie(res);
    return { success: true as const };
  }
}
