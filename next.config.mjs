/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['i.redd.it', 'preview.redd.it', 'media.giphy.com'],
  },
};

export default nextConfig;
