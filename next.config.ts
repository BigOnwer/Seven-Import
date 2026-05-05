import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '../app/generated/prisma'],
};

export default nextConfig;
