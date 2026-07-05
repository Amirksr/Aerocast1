import mongoose, { Schema, model, models } from "mongoose";
import { connectToDatabase, isMongoConfigured } from "./db";
import { seedData } from "./seed-data";

// ─────────────────────────────────────────────────────────────
// Mongoose models (only used when MONGODB_URI is configured)
// ─────────────────────────────────────────────────────────────

const FavoriteSchema = new Schema(
  {
    placeId: { type: Number, default: 0 },
    name: { type: String, required: true },
    admin1: { type: String, default: "" },
    country: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

const SearchHistorySchema = new Schema(
  {
    name: { type: String, required: true },
    country: { type: String, default: "" },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

const ContactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    topic: { type: String, default: "general" },
    message: { type: String, required: true },
    status: { type: String, default: "new" },
  },
  { timestamps: true }
);

const NewsletterSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

const StatSchema = new Schema(
  { key: { type: String, unique: true }, value: { type: Number, default: 0 } },
  { timestamps: true }
);

function getModel<T = any>(name: string, schema: Schema) {
  if (models[name]) return models[name] as mongoose.Model<T>;
  return model<T>(name, schema);
}

const Favorite = getModel("Favorite", FavoriteSchema);
const SearchHistory = getModel("SearchHistory", SearchHistorySchema);
const Contact = getModel("Contact", ContactSchema);
const Newsletter = getModel("Newsletter", NewsletterSchema);
const Stat = getModel("Stat", StatSchema);

// ─────────────────────────────────────────────────────────────
// In-memory fallback store (used when no MongoDB is configured)
// ─────────────────────────────────────────────────────────────

const mem = {
  favorites: [] as any[],
  history: [] as any[],
  contacts: [] as any[],
  subscribers: [] as any[],
  stats: { ...seedData.stats } as Record<string, number>,
  _id: 1,
};

function nextId() {
  return mem._id++;
}

// ─────────────────────────────────────────────────────────────
// Public, database-agnostic API used by the API routes
// ─────────────────────────────────────────────────────────────

export interface FavoriteInput {
  placeId?: number;
  name: string;
  admin1?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  note?: string;
}

export const favorites = {
  async list(): Promise<any[]> {
    if (isMongoConfigured) {
      await connectToDatabase();
      return Favorite.find().sort({ createdAt: -1 }).lean();
    }
    return [...mem.favorites].reverse();
  },
  async add(input: FavoriteInput): Promise<any> {
    if (isMongoConfigured) {
      await connectToDatabase();
      const existing = await Favorite.findOne({
        latitude: input.latitude,
        longitude: input.longitude,
      });
      if (existing) return existing;
      return Favorite.create(input);
    }
    const existing = mem.favorites.find(
      (f) => f.latitude === input.latitude && f.longitude === input.longitude
    );
    if (existing) return existing;
    const created = {
      _id: nextId(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    mem.favorites.push(created);
    return created;
  },
  async remove(id: string): Promise<boolean> {
    if (isMongoConfigured) {
      await connectToDatabase();
      const res = await Favorite.deleteOne({ _id: id });
      return res.deletedCount > 0;
    }
    const before = mem.favorites.length;
    mem.favorites = mem.favorites.filter((f) => String(f._id) !== id);
    return mem.favorites.length < before;
  },
};

export const searchHistory = {
  async list(limit = 10): Promise<any[]> {
    if (isMongoConfigured) {
      await connectToDatabase();
      return SearchHistory.find().sort({ createdAt: -1 }).limit(limit).lean();
    }
    return [...mem.history].reverse().slice(0, limit);
  },
  async add(input: {
    name: string;
    country?: string;
    latitude: number;
    longitude: number;
  }): Promise<any> {
    if (isMongoConfigured) {
      await connectToDatabase();
      // Keep only the most recent 25 entries per the rolling log strategy.
      const created = await SearchHistory.create(input);
      const count = await SearchHistory.countDocuments();
      if (count > 25) {
        const oldest = await SearchHistory.find()
          .sort({ createdAt: 1 })
          .limit(count - 25);
        const ids = oldest.map((o) => o._id);
        await SearchHistory.deleteMany({ _id: { $in: ids } });
      }
      return created;
    }
    mem.history.push({ _id: nextId(), ...input, createdAt: new Date().toISOString() });
    if (mem.history.length > 25) mem.history.shift();
    return mem.history[mem.history.length - 1];
  },
};

export const contacts = {
  async submit(input: {
    name: string;
    email: string;
    topic?: string;
    message: string;
  }): Promise<any> {
    if (isMongoConfigured) {
      await connectToDatabase();
      return Contact.create(input);
    }
    const created = {
      _id: nextId(),
      ...input,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    mem.contacts.push(created);
    return created;
  },
  async list(): Promise<any[]> {
    if (isMongoConfigured) {
      await connectToDatabase();
      return Contact.find().sort({ createdAt: -1 }).lean();
    }
    return [...mem.contacts].reverse();
  },
};

export const newsletter = {
  async subscribe(email: string, tags: string[] = []): Promise<{
    status: "created" | "exists";
    subscriber: any;
  }> {
    const normalized = email.trim().toLowerCase();
    if (isMongoConfigured) {
      await connectToDatabase();
      const existing = await Newsletter.findOne({ email: normalized });
      if (existing) return { status: "exists", subscriber: existing };
      const created = await Newsletter.create({ email: normalized, tags });
      return { status: "created", subscriber: created };
    }
    const existing = mem.subscribers.find((s) => s.email === normalized);
    if (existing) return { status: "exists", subscriber: existing };
    const created = {
      _id: nextId(),
      email: normalized,
      tags,
      createdAt: new Date().toISOString(),
    };
    mem.subscribers.push(created);
    bumpStat("subscribers");
    return { status: "created", subscriber: created };
  },
  async list(): Promise<any[]> {
    if (isMongoConfigured) {
      await connectToDatabase();
      return Newsletter.find().sort({ createdAt: -1 }).lean();
    }
    return [...mem.subscribers].reverse();
  },
};

export const stats = {
  async get(): Promise<Record<string, number>> {
    if (isMongoConfigured) {
      await connectToDatabase();
      const docs = await Stat.find();
      const out: Record<string, number> = { ...seedData.stats };
      for (const d of docs) out[d.key] = d.value;
      return out;
    }
    return { ...mem.stats };
  },
  async bump(key: string, by = 1): Promise<void> {
    mem.stats[key] = (mem.stats[key] ?? 0) + by;
    if (isMongoConfigured) {
      await connectToDatabase();
      await Stat.updateOne({ key }, { $inc: { value: by } }, { upsert: true });
    }
  },
};

function bumpStat(key: string) {
  mem.stats[key] = (mem.stats[key] ?? 0) + 1;
}

export { isMongoConfigured };
