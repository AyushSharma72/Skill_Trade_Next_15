/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "skilltrade-backed.onrender.com",
      },
      {
        protocol: "https",
        hostname: "skill-trade-next-15.vercel.app",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "https",     // Added for Unsplash images for setting up the MarqueeImages component
        hostname: "images.unsplash.com",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
