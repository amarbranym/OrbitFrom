const apiInternalUrl = process.env.API_INTERNAL_URL ?? "http://localhost:8000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/v1/create-qr-code/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.launchuicomponents.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/trpc/:path*",
        destination: `${apiInternalUrl}/trpc/:path*`,
      },
      {
        source: "/docs",
        destination: `${apiInternalUrl}/docs`,
      },
      {
        source: "/openapi.json",
        destination: `${apiInternalUrl}/openapi.json`,
      },
    ];
  },
};

export default nextConfig;
