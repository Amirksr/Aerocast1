// Static seed values for the in-memory fallback and landing-page stats.

export const seedData = {
  stats: {
    forecasts: 2480000,
    cities: 198000,
    subscribers: 124000,
    uptime: 99.98,
  },
};

// Curated "popular cities" used to kick-start the experience and to seed
// the MongoDB favourite list on first run.
export const popularCities = [
  { name: "Tehran", country: "Iran", countryCode: "IR", latitude: 35.6944, longitude: 51.4215 },
  { name: "London", country: "United Kingdom", countryCode: "GB", latitude: 51.5074, longitude: -0.1278 },
  { name: "New York", country: "United States", countryCode: "US", latitude: 40.7128, longitude: -74.006 },
  { name: "Tokyo", country: "Japan", countryCode: "JP", latitude: 35.6762, longitude: 139.6503 },
  { name: "Dubai", country: "United Arab Emirates", countryCode: "AE", latitude: 25.2048, longitude: 55.2708 },
  { name: "Istanbul", country: "Turkey", countryCode: "TR", latitude: 41.0082, longitude: 28.9784 },
  { name: "Sydney", country: "Australia", countryCode: "AU", latitude: -33.8688, longitude: 151.2093 },
  { name: "Paris", country: "France", countryCode: "FR", latitude: 48.8566, longitude: 2.3522 },
];
