import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Vercel's /_next/image optimizer returns 402 on this plan; all images are
  // pre-optimized local assets, so serve them directly.
  images: { unoptimized: true },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // the floating dev-tools "N" bubble reads as a broken UI chip to
  // visitors of the preview — turn it off entirely
  devIndicators: false,
  // Allow the sandbox preview gateway origin(s) so cross-origin dev assets
  // (HMR websocket, JS chunks, images) are served correctly inside the
  // preview iframe instead of being rejected / stale-cached.
  allowedDevOrigins: ["*.space-z.ai", "localhost", "*.z.ai"],
};

export default nextConfig;
