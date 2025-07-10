/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to allow dynamic API routes to function
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  optimizeFonts: false,
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;