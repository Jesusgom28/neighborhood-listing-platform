import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use this project's folder as the Turbopack root.
  // This prevents Next.js from detecting an unrelated
  // package-lock.json in a parent directory.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
