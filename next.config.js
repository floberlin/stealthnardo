/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
