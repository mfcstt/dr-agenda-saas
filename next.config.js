/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    NUQS_ADAPTER: "next",
  },
};

module.exports = nextConfig;
