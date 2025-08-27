import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gtfdenahectwmikokxmc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product-images/**',
      },
      {
        protocol: 'https',
        hostname: 'gtfdenahectwmikokxmc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/tryon-images/**',
      },
    ],
  },
};

export default nextConfig;
