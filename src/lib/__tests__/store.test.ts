// These tests exercise the in-memory fallback path (isMongoConfigured === false),
// which is what runs in local dev / demos without a MONGODB_URI. Mongo-backed
// behavior is intentionally out of scope here — it would require a real or
// mocked MongoDB connection to test meaningfully.

process.env.MONGODB_URI = "";

import { favorites, searchHistory, contacts, newsletter, stats } from "@/lib/store";

describe("favorites (in-memory fallback)", () => {
  it("adds a favorite and lists it back, newest first", async () => {
    await favorites.add({ name: "Isfahan", latitude: 32.65, longitude: 51.67 });
    await favorites.add({ name: "Berlin", latitude: 52.52, longitude: 13.4 });

    const list = await favorites.list();
    expect(list[0].name).toBe("Berlin");
    expect(list[1].name).toBe("Isfahan");
  });

  it("does not create a duplicate for the same coordinates", async () => {
    const before = (await favorites.list()).length;
    await favorites.add({ name: "Berlin", latitude: 52.52, longitude: 13.4 });
    const after = (await favorites.list()).length;
    expect(after).toBe(before);
  });

  it("removes a favorite by id", async () => {
    const created = await favorites.add({ name: "Dubai", latitude: 25.2, longitude: 55.27 });
    const removed = await favorites.remove(String(created._id));
    expect(removed).toBe(true);
    const list = await favorites.list();
    expect(list.find((f) => f._id === created._id)).toBeUndefined();
  });

  it("returns false when removing a non-existent id", async () => {
    const removed = await favorites.remove("does-not-exist");
    expect(removed).toBe(false);
  });
});

describe("searchHistory (in-memory fallback)", () => {
  it("caps the log at 25 entries, dropping the oldest", async () => {
    for (let i = 0; i < 30; i++) {
      await searchHistory.add({ name: `City ${i}`, latitude: i, longitude: i });
    }
    const list = await searchHistory.list(100);
    expect(list.length).toBeLessThanOrEqual(25);
    // Most recent entry should be first.
    expect(list[0].name).toBe("City 29");
  });
});

describe("contacts (in-memory fallback)", () => {
  it("stores a submitted message with a default status", async () => {
    const created = await contacts.submit({
      name: "Amir",
      email: "amir@example.com",
      message: "Hello there",
    });
    expect(created.status).toBe("new");

    const list = await contacts.list();
    expect(list[0].message).toBe("Hello there");
  });
});

describe("newsletter (in-memory fallback)", () => {
  it("subscribes a new email and normalizes casing/whitespace", async () => {
    const result = await newsletter.subscribe("  Test@Example.com ".trim());
    expect(result.status).toBe("created");
    expect(result.subscriber.email).toBe("test@example.com");
  });

  it("reports an existing subscription instead of duplicating it", async () => {
    await newsletter.subscribe("dup@example.com");
    const second = await newsletter.subscribe("dup@example.com");
    expect(second.status).toBe("exists");
  });
});

describe("stats (in-memory fallback)", () => {
  it("bumps a counter by the given amount", async () => {
    const before = (await stats.get()).searches ?? 0;
    await stats.bump("searches");
    await stats.bump("searches", 2);
    const after = (await stats.get()).searches;
    expect(after).toBe(before + 3);
  });
});
