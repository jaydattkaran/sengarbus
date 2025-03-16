import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://sengarbus.onrender.com/api/:path*', // Replace with your backend URL
      },
    ];
  },
};

export default nextConfig;
