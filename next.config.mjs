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
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
