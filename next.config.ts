import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure proper asset handling
  images: {
    unoptimized: true, // Vercel handles optimization automatically
  },
  // Enable server components
  reactStrictMode: true,
};

export default nextConfig;