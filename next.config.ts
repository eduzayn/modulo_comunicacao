import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['*'], // Allow images from any domain
    unoptimized: process.env.NODE_ENV === 'development' // Disable optimization in dev for faster builds
  }
};

export default nextConfig;
