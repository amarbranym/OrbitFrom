export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "EMAIL_TAKEN"
      | "EMAIL_NOT_FOUND"
      | "OTP_INVALID"
      | "OTP_EXPIRED"
      | "OTP_COOLDOWN"
      | "OTP_MAX_ATTEMPTS"
      | "VALIDATION",
  ) {
    super(message);
    this.name = "AuthError";
  }
}
