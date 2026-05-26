export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MS = 5 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_MS = 30 * 1000;
export const OTP_MAX_VERIFY_ATTEMPTS = 5;
export const SESSION_COOKIE_NAME = "orbit_session";
export const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export const OTP_PURPOSES = ["signup", "login"] as const;
export type OtpPurpose = (typeof OTP_PURPOSES)[number];
