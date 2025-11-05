import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  experimental: {
    // Allow dev tunnels like loca.lt, ngrok, etc.
    allowedDevOrigins: [
      // Match all loca.lt tunnels
      /\.loca\.lt$/,
    ],
  },
};

export default nextConfig;
