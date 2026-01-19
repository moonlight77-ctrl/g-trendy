import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
    // Attention : Cela permet de builder même avec des erreurs ESLint
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    // Attention : Cela permet de builder même avec des erreurs TypeScript
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "aowesutiqjlvavuhcmcg.supabase.co", // ton bucket Supabase
      "images.unsplash.com"               // Unsplash
    ],
  },
};
module.exports = nextConfig;
export default nextConfig;

