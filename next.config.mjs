/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repo = "Haparlamentor";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repo}` : "",
  },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
