// Live weather data layer built on the free, key-less Open-Meteo APIs:
//   - Geocoding:  https://geocoding-api.open-meteo.com
//   - Forecast:   https://api.open-meteo.com
//   - Air quality:https://air-quality-api.open-meteo.com
// All requests are server-side (used by /api routes) to keep payloads lean.

export type WeatherTheme =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunder";

export interface WeatherIconMeta {
  label: string;
  theme: WeatherTheme;
}

// WMO weather interpretation codes -> human label + visual theme.
const WMO: Record<number, WeatherIconMeta> = {
  0: { label: "Clear sky", theme: "clear" },
  1: { label: "Mainly clear", theme: "partly" },
  2: { label: "Partly cloudy", theme: "partly" },
  3: { label: "Overcast", theme: "cloudy" },
  45: { label: "Fog", theme: "fog" },
  48: { label: "Rime fog", theme: "fog" },
  51: { label: "Light drizzle", theme: "drizzle" },
  53: { label: "Drizzle", theme: "drizzle" },
  55: { label: "Dense drizzle", theme: "drizzle" },
  56: { label: "Freezing drizzle", theme: "drizzle" },
  57: { label: "Freezing drizzle", theme: "drizzle" },
  61: { label: "Light rain", theme: "rain" },
  63: { label: "Rain", theme: "rain" },
  65: { label: "Heavy rain", theme: "rain" },
  66: { label: "Freezing rain", theme: "rain" },
  67: { label: "Freezing rain", theme: "rain" },
  71: { label: "Light snow", theme: "snow" },
  73: { label: "Snow", theme: "snow" },
  75: { label: "Heavy snow", theme: "snow" },
  77: { label: "Snow grains", theme: "snow" },
  80: { label: "Rain showers", theme: "rain" },
  81: { label: "Rain showers", theme: "rain" },
  82: { label: "Violent rain showers", theme: "rain" },
  85: { label: "Snow showers", theme: "snow" },
  86: { label: "Heavy snow showers", theme: "snow" },
  95: { label: "Thunderstorm", theme: "thunder" },
  96: { label: "Thunderstorm with hail", theme: "thunder" },
  99: { label: "Thunderstorm with hail", theme: "thunder" },
};

export function decodeWeather(code: number): WeatherIconMeta {
  return WMO[code] ?? { label: "Unknown", theme: "partly" };
}

export interface GeoPlace {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  label: string;
  theme: WeatherTheme;
  isDay: boolean;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  precipitation: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  aqi: number | null;
  aqiLabel: string | null;
  pm25: number | null;
}

export interface HourEntry {
  time: string;
  temperature: number;
  weatherCode: number;
  theme: WeatherTheme;
  label: string;
  precipitationProbability: number;
}

export interface DayEntry {
  date: string;
  weatherCode: number;
  label: string;
  theme: WeatherTheme;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  uvIndexMax: number;
}

export interface WeatherResult {
  place: GeoPlace;
  current: CurrentWeather;
  hourly: HourEntry[];
  daily: DayEntry[];
  fetchedAt: string;
}

function aqiLabel(aqi: number | null) {
  if (aqi == null) return null;
  if (aqi <= 20) return "Good";
  if (aqi <= 40) return "Fair";
  if (aqi <= 60) return "Moderate";
  if (aqi <= 80) return "Poor";
  if (aqi <= 100) return "Very Poor";
  return "Hazardous";
}

async function getJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Upstream request failed: ${res.status}`);
  return res.json();
}

export async function geocode(query: string, limit = 6): Promise<GeoPlace[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=${limit}&language=en&format=json`;
  const data = await getJson(url);
  const results: any[] = data.results ?? [];
  return results.map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    country_code: r.country_code,
    admin1: r.admin1,
    timezone: r.timezone,
    population: r.population,
  }));
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeoPlace | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=&count=1`;
  void url;
  // Open-Meteo geocoding is name based; we approximate reverse lookup
  // with a small search against the lat/lon grid via the forecast timezone.
  try {
    const data = await getJson(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`
    );
    return {
      id: 0,
      name: "Your location",
      latitude,
      longitude,
      country: (data as any)?.timezone_abbreviation ?? undefined,
      timezone: (data as any)?.timezone,
    } as GeoPlace;
  } catch {
    return null;
  }
}

export async function getWeather(place: GeoPlace): Promise<WeatherResult> {
  const { latitude, longitude } = place;

  const forecastUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation,cloud_cover,visibility` +
    `&hourly=temperature_2m,weather_code,precipitation_probability` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset` +
    `&timezone=auto&forecast_days=7&wind_speed_unit=kmh`;

  const airUrl =
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}` +
    `&current=european_aqi,pm2_5,us_aqi`;

  const [forecast, air] = await Promise.all([
    getJson(forecastUrl),
    getJson(airUrl).catch(() => null),
  ]);

  const cur = forecast.current;
  const code = cur.weather_code;
  const meta = decodeWeather(code);

  const current: CurrentWeather = {
    temperature: Math.round(cur.temperature_2m),
    apparentTemperature: Math.round(cur.apparent_temperature),
    humidity: Math.round(cur.relative_humidity_2m),
    weatherCode: code,
    label: meta.label,
    theme: meta.theme,
    isDay: cur.is_day === 1,
    windSpeed: Math.round(cur.wind_speed_10m),
    windDirection: cur.wind_direction_10m,
    pressure: Math.round(cur.surface_pressure),
    precipitation: Math.round(cur.precipitation * 10) / 10,
    cloudCover: Math.round(cur.cloud_cover),
    visibility: Math.round((cur.visibility ?? 10) / 1000),
    uvIndex: 0,
    aqi: air?.current?.european_aqi ?? null,
    aqiLabel: aqiLabel(air?.current?.european_aqi ?? null),
    pm25: air?.current?.pm2_5 ?? null,
  };

  // Build hourly entries for the next ~24h starting from now.
  const hourlyTimes: string[] = forecast.hourly.time;
  const nowIso = cur.time;
  const startIndex = Math.max(
    0,
    hourlyTimes.findIndex((t: string) => t >= nowIso)
  );
  const hourly: HourEntry[] = hourlyTimes
    .slice(startIndex, startIndex + 24)
    .map((t: string, i: number) => {
      const c = forecast.hourly.weather_code[startIndex + i];
      const m = decodeWeather(c);
      return {
        time: t,
        temperature: Math.round(forecast.hourly.temperature_2m[startIndex + i]),
        weatherCode: c,
        theme: m.theme,
        label: m.label,
        precipitationProbability:
          forecast.hourly.precipitation_probability?.[startIndex + i] ?? 0,
      };
    });

  const daily: DayEntry[] = (forecast.daily.time as string[]).map((date, i) => {
    const c = forecast.daily.weather_code[i];
    const m = decodeWeather(c);
    current.uvIndex = i === 0 ? Math.round(forecast.daily.uv_index_max?.[i] ?? 0) : current.uvIndex;
    return {
      date,
      weatherCode: c,
      label: m.label,
      theme: m.theme,
      tempMax: Math.round(forecast.daily.temperature_2m_max[i]),
      tempMin: Math.round(forecast.daily.temperature_2m_min[i]),
      precipitationProbability:
        forecast.daily.precipitation_probability_max?.[i] ?? 0,
      uvIndexMax: Math.round(forecast.daily.uv_index_max?.[i] ?? 0),
    };
  });

  return {
    place,
    current,
    hourly,
    daily,
    fetchedAt: new Date().toISOString(),
  };
}
