// Small, dependency-free validation helpers. Kept separate from the route
// handlers so the rules themselves can be unit tested without needing to
// construct a fake NextRequest.

export const CONTACT_TOPICS = ["general", "support", "billing", "partnership", "feedback"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactInput {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function validateContact(body: Record<string, unknown>): ValidationResult<ContactInput> {
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const topic = (CONTACT_TOPICS as readonly string[]).includes(body.topic as string)
    ? (body.topic as ContactTopic)
    : "general";

  if (name.length < 2) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }
  if (message.length < 10) {
    return { ok: false, error: "Your message should be at least 10 characters." };
  }

  return { ok: true, value: { name, email, topic, message } };
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}
