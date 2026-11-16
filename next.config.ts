import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // Für Docker-Deployment: schlanker Server-Bundle ohne node_modules im Image
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.flario.de" },
      { protocol: "https", hostname: "**.flario.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
    ];
  },
};

export default config;
