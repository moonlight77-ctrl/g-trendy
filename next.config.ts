import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "aowesutiqjlvavuhcmcg.supabase.co", // ton bucket Supabase
      "images.unsplash.com"               // Unsplash
    ],
  },
};
module.exports = nextConfig;
export default nextConfig;

