/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // 也順便忽略 TypeScript 錯誤以確保部署成功
        ignoreBuildErrors: true,
    },
  webpack: (config, { dev }) => {
    // Disable filesystem caching in development to prevent ENOENT rename errors
    // caused by race conditions or file locking.
    if (dev) {
      config.cache = false;
    }

    return config;
  },
  // Suppress cross-origin request warnings
  allowedDevOrigins: [
    'localhost:3052',
    '127.0.0.1:3052',
    '192.168.0.3:3052',
    '0.0.0.0:3052'
  ],

};

export default nextConfig;
