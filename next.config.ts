import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Vercel returns 402 Payment Required for /_next/image on this plan,
  // which breaks every next/image on the deployed site. All remote-hosted
  // images here are already pre-optimized local .webp/.png assets, so the
  // optimizer adds no value — serve them directly instead.
  images: { unoptimized: true },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the sandbox preview gateway origin(s) so cross-origin dev assets
  // (HMR websocket, JS chunks, images) are served correctly inside the
  // preview iframe instead of being rejected / stale-cached.
  allowedDevOrigins: ["*.space-z.ai", "localhost", "*.z.ai"],
};

export default nextConfig;
