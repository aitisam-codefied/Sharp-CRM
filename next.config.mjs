// next.config.js

import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // You can add more Next.js settings here as needed
};

export default nextConfig

// const pwaConfig = withPWA({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: false,
// });

// export default pwaConfig(nextConfig);