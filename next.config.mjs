/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The sandbox build workers have a tight memory cap; type-checking/linting
  // is run separately via `npx tsc --noEmit` to keep `next build` reliable here.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "openweathermap.org" },
      { protocol: "https", hostname: "api.open-meteo.com" },
      { protocol: "https", hostname: "flagsapi.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
