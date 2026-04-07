import type { NextConfig } from "next";

const origensDevRedeLocal = [
  "localhost",
  "*.localhost",
  "127.0.0.1",
  "0.0.0.0",
  "192.168.*.*",
  "10.*.*.*",
  "172.16.*.*",
  "172.17.*.*",
  "172.18.*.*",
  "172.19.*.*",
  "172.20.*.*",
  "172.21.*.*",
  "172.22.*.*",
  "172.23.*.*",
  "172.24.*.*",
  "172.25.*.*",
  "172.26.*.*",
  "172.27.*.*",
  "172.28.*.*",
  "172.29.*.*",
  "172.30.*.*",
  "172.31.*.*",
  "*.local",
] as const;

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [...origensDevRedeLocal],
  experimental: {
    optimizePackageImports: ["@hugeicons/react", "@hugeicons/core-free-icons"],
  },
  async headers() {
    return [
      {
        source: "/imagens/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/favicon.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
