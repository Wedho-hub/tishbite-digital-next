// Shared across every public form that collects an email address (contact,
// onboarding, subscribers). Deliberately stricter than "contains an @" —
// quotes, parens, semicolons and angle brackets are valid in RFC 5322's
// full grammar but are exactly what nodemailer's address parser has had
// real parsing/DoS bugs around, and this field often flows straight into
// `to`/`replyTo`. Rejecting those characters up front closes that off
// regardless of the nodemailer version in use.
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(value) {
  return typeof value === "string" && value.length <= 254 && EMAIL_PATTERN.test(value);
}
