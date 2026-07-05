import { validateContact, isValidEmail } from "@/lib/validation";

describe("validateContact", () => {
  const valid = {
    name: "Amir Kasraeian",
    email: "amir@example.com",
    topic: "support",
    message: "Hi, I have a question about the API rate limits.",
  };

  it("accepts a fully valid submission", () => {
    const result = validateContact(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.topic).toBe("support");
    }
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = validateContact({ ...valid, name: "A" });
    expect(result).toEqual({ ok: false, error: "Please enter your name." });
  });

  it("rejects an invalid email", () => {
    const result = validateContact({ ...valid, email: "not-an-email" });
    expect(result).toEqual({ ok: false, error: "Please enter a valid email." });
  });

  it("rejects a message shorter than 10 characters", () => {
    const result = validateContact({ ...valid, message: "too short" });
    expect(result).toEqual({
      ok: false,
      error: "Your message should be at least 10 characters.",
    });
  });

  it("falls back to the 'general' topic for an unknown/missing topic", () => {
    const result = validateContact({ ...valid, topic: "not-a-real-topic" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.topic).toBe("general");
    }
  });

  it("trims whitespace from name, email and message", () => {
    const result = validateContact({
      ...valid,
      name: "  Amir  ",
      email: "  amir@example.com  ",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("Amir");
      expect(result.value.email).toBe("amir@example.com");
    }
  });
});

describe("isValidEmail", () => {
  it.each(["a@b.com", "amir.k@example.co", "test+tag@example.io"])(
    "accepts %s",
    (email) => {
      expect(isValidEmail(email)).toBe(true);
    }
  );

  it.each(["", "no-at-sign.com", "missing-domain@", "@missing-local.com"])(
    "rejects %s",
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    }
  );
});
