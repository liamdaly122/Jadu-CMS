/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.leeds.ac.uk" },
      { protocol: "https", hostname: "jaducdn.leeds.ac.uk" },
    ],
  },
};

export default nextConfig;
