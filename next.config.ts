import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ['aowesutiqjlvavuhcmcg.supabase.co'], // <-- autorise Supabase
  },
};
module.exports = nextConfig;
export default nextConfig;
