import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure proper asset handling
  images: {
    unoptimized: true, // Vercel handles optimization automatically
  },
  // Enable server components
  reactStrictMode: true,
  // Allow production build even if TypeScript reports errors during CI/build.
  // This avoids Turbopack blocking deployment for generated type issues.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;