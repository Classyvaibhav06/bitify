import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
