// // next.config.js

// import withPWA from 'next-pwa';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   // output: 'standalone',
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
//   // You can add more Next.js settings here as needed
// };

// export default nextConfig

// // const pwaConfig = withPWA({
// //   dest: 'public',
// //   register: true,
// //   skipWaiting: true,
// //   disable: false,
// // });

// // export default pwaConfig(nextConfig);

// next.config.js
import withPWA from 'next-pwa';

const isNative = process.env.NEXT_PUBLIC_IS_NATIVE === 'true';

/** @type {import('next').NextConfig} */
const baseConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isNative, // 🚀 disables PWA when building for native
});

export default pwaConfig(baseConfig);
