// Seed the MongoDB database with starting stats and a few sample favourites.
// Usage: MONGODB_URI="mongodb+srv://..." node scripts/seed.mjs
//
// If MONGODB_URI is not set the script exits with a friendly notice — the app
// runs perfectly well on its in-memory fallback store without a database.

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log(
    "\nℹ️  MONGODB_URI is not set. The AeroCast API works out of the box with an\n" +
      "   in-memory store, so there is nothing to seed. Set MONGODB_URI to a real\n" +
      "   MongoDB connection string and re-run this script to seed persistent data.\n"
  );
  process.exit(0);
}

const STATS = {
  forecasts: 2480000,
  cities: 198000,
  subscribers: 124000,
  uptime: 99.98,
};

const POPULAR = [
  { name: "Tehran", country: "Iran", latitude: 35.6944, longitude: 51.4215, admin1: "Tehran" },
  { name: "London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278 },
  { name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
];

const StatSchema = new mongoose.Schema(
  { key: { type: String, unique: true }, value: Number },
  { timestamps: true }
);
const FavoriteSchema = new mongoose.Schema(
  {
    placeId: Number,
    name: String,
    admin1: String,
    country: String,
    countryCode: String,
    latitude: Number,
    longitude: Number,
  },
  { timestamps: true }
);

const Stat = mongoose.models.Stat || mongoose.model("Stat", StatSchema);
const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || "aero_weather" });
  console.log("Connected to MongoDB. Seeding…");

  for (const [key, value] of Object.entries(STATS)) {
    await Stat.updateOne({ key }, { $set: { value } }, { upsert: true });
  }

  for (const city of POPULAR) {
    await Favorite.updateOne(
      { latitude: city.latitude, longitude: city.longitude },
      { $set: city },
      { upsert: true }
    );
  }

  const stats = await Stat.countDocuments();
  const favs = await Favorite.countDocuments();
  console.log(`✓ Seeded ${Object.keys(STATS).length} stats and ${POPULAR.length} favourites.`);
  console.log(`  (DB now holds ${favs} favourites and ${stats} stat keys.)`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
