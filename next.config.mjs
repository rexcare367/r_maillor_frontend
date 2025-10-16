/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.aucoffre.com',
        port: '',
        pathname: '/picture/product/**',
      },
    ],
  },
};

export default nextConfig;
