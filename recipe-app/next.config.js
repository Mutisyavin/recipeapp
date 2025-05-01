/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['fs', 'path'],
  },
  webpack: (config) => {
    // Handle Node.js modules
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      path: false 
    };
    return config;
  },
};

module.exports = nextConfig; 