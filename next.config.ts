import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qsmvrymkhkwrvypjejdt.supabase.co",
        pathname: "/storage/v1/object/public/avatars/**",
}
    ],
  },
};

export default nextConfig;
