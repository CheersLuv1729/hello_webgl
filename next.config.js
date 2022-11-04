/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
	unoptimized: true,
  },
  basePath: "/hello_webgl",
  assetPrefix: "/hello_webgl",
}

module.exports = nextConfig
