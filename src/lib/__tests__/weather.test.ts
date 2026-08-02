import { decodeWeather, geocode, getWeather, mergeWithEnglishNames, type GeoPlace } from "@/lib/weather";

// We mock global fetch rather than hitting the real Open-Meteo API, so the
// suite is fast, deterministic and works offline / in CI.
const originalFetch = global.fetch;

function mockFetchOnce(payload: unknown, ok = true, status = 200) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status,
    json: async () => payload,
  });
}

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
  global.fetch = originalFetch;
});

describe("decodeWeather", () => {
  it("maps known WMO codes to the correct label and theme", () => {
    expect(decodeWeather(0)).toEqual({ label: "Clear sky", theme: "clear" });
    expect(decodeWeather(61)).toEqual({ label: "Light rain", theme: "rain" });
    expect(decodeWeather(95)).toEqual({ label: "Thunderstorm", theme: "thunder" });
  });

  it("falls back to a safe default for unknown codes", () => {
    expect(decodeWeather(9999)).toEqual({ label: "Unknown", theme: "partly" });
  });
});

describe("geocode", () => {
  it("maps Open-Meteo geocoding results into GeoPlace objects", async () => {
    mockFetchOnce({
      results: [
        {
          id: 112931,
          name: "Isfahan",
          latitude: 32.65246,
          longitude: 51.67462,
          country: "Iran",
          country_code: "IR",
          admin1: "Isfahan",
          timezone: "Asia/Tehran",
          population: 1961260,
        },
      ],
    });

    const places = await geocode("Isfahan");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(places).toHaveLength(1);
    expect(places[0]).toMatchObject({
      name: "Isfahan",
      country: "Iran",
      latitude: 32.65246,
      longitude: 51.67462,
    });
  });

  it("returns an empty array when the API has no matches", async () => {
    mockFetchOnce({ results: [] });
    const places = await geocode("xyzzynotaplace");
    expect(places).toEqual([]);
  });

  it("throws when the upstream API responds with an error status", async () => {
    mockFetchOnce({}, false, 500);
    await expect(geocode("Isfahan")).rejects.toThrow("Upstream request failed: 500");
  });
});

describe("mergeWithEnglishNames", () => {
  it("attaches the English name/admin1 when it differs from the localized one", () => {
    const primary = [
      { id: 112931, name: "اصفهان", latitude: 32.65, longitude: 51.67, admin1: "اصفهان" },
    ];
    const english = [
      { id: 112931, name: "Isfahan", latitude: 32.65, longitude: 51.67, admin1: "Isfahan" },
    ];
    const merged = mergeWithEnglishNames(primary, english);
    expect(merged[0].nameEn).toBe("Isfahan");
    expect(merged[0].admin1En).toBe("Isfahan");
    expect(merged[0].name).toBe("اصفهان"); // primary name untouched
  });

  it("does not attach nameEn when the localized name is already identical to English", () => {
    const primary = [{ id: 1, name: "Berlin", latitude: 52.5, longitude: 13.4 }];
    const english = [{ id: 1, name: "Berlin", latitude: 52.5, longitude: 13.4 }];
    const merged = mergeWithEnglishNames(primary, english);
    expect(merged[0].nameEn).toBeUndefined();
  });

  it("leaves a place untouched if no matching id exists in the English list", () => {
    const primary = [{ id: 999, name: "جایی", latitude: 1, longitude: 1 }];
    const merged = mergeWithEnglishNames(primary, []);
    expect(merged[0].nameEn).toBeUndefined();
    expect(merged[0].name).toBe("جایی");
  });

  it("matches results by id, not by array position", () => {
    const primary = [
      { id: 2, name: "دوم", latitude: 2, longitude: 2 },
      { id: 1, name: "اول", latitude: 1, longitude: 1 },
    ];
    const english = [
      { id: 1, name: "First", latitude: 1, longitude: 1 },
      { id: 2, name: "Second", latitude: 2, longitude: 2 },
    ];
    const merged = mergeWithEnglishNames(primary, english);
    expect(merged.find((p) => p.id === 1)?.nameEn).toBe("First");
    expect(merged.find((p) => p.id === 2)?.nameEn).toBe("Second");
  });
});

describe("getWeather", () => {
  const place: GeoPlace = {
    id: 112931,
    name: "Isfahan",
    latitude: 32.65246,
    longitude: 51.67462,
    country: "Iran",
  };

  function forecastPayload() {
    return {
      current: {
        time: "2026-07-05T12:00",
        temperature_2m: 34.4,
        apparent_temperature: 33.1,
        relative_humidity_2m: 18,
        weather_code: 0,
        is_day: 1,
        wind_speed_10m: 11.2,
        wind_direction_10m: 270,
        surface_pressure: 1008.3,
        precipitation: 0,
        cloud_cover: 5,
        visibility: 24000,
      },
      hourly: {
        time: ["2026-07-05T12:00", "2026-07-05T13:00"],
        temperature_2m: [34.4, 35.1],
        weather_code: [0, 1],
        precipitation_probability: [0, 0],
      },
      daily: {
        time: ["2026-07-05", "2026-07-06"],
        weather_code: [0, 1],
        temperature_2m_max: [39, 38],
        temperature_2m_min: [24, 23],
        precipitation_probability_max: [0, 5],
        uv_index_max: [9.4, 8.7],
      },
    };
  }

  it("assembles current/hourly/daily data from the two upstream responses", async () => {
    mockFetchOnce(forecastPayload());
    mockFetchOnce({ current: { european_aqi: 32, pm2_5: 11.4, us_aqi: 40 } });

    const result = await getWeather(place);

    expect(result.place).toEqual(place);
    expect(result.current.temperature).toBe(34);
    expect(result.current.theme).toBe("clear");
    expect(result.current.aqi).toBe(32);
    expect(result.current.aqiLabel).toBe("Fair");
    expect(result.hourly).toHaveLength(2);
    expect(result.daily).toHaveLength(2);
    expect(result.daily[0].tempMax).toBe(39);
    expect(result.current.uvIndex).toBe(9);
  });

  it("still returns weather data when the air-quality request fails", async () => {
    mockFetchOnce(forecastPayload());
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("network down"));

    const result = await getWeather(place);

    expect(result.current.aqi).toBeNull();
    expect(result.current.aqiLabel).toBeNull();
    expect(result.current.temperature).toBe(34);
  });

  it("propagates an error when the forecast request itself fails", async () => {
    mockFetchOnce({}, false, 503);
    await expect(getWeather(place)).rejects.toThrow("Upstream request failed: 503");
  });
});
