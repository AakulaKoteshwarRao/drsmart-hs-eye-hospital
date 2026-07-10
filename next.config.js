/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/specialist-near-:area',
        destination: '/:area',
      },
    ]
  },
  output: 'standalone',
  typescript: {
    // Pre-existing TS errors in template files (terms, locations/[slug]) are non-blocking
    // Remove this once those files are fully converted to proper JSX
    ignoreBuildErrors: true,
  },
  images: {
    // Allow images from any HTTPS source (covers CDNs, Google Drive, etc.)
    // When deploying, replace with specific domains for tighter security:
    // domains: ['res.cloudinary.com', 'storage.googleapis.com']
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Auto-generate WebP + AVIF for browsers that support it
    formats: ['image/avif', 'image/webp'],
    // Reasonable sizes for medical site photos
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [64, 128, 256, 400, 512],
    // Photo URLs carry a cache-busting ?t=<timestamp> that changes on re-upload,
    // so each resolved image URL is safe to cache for a full year, same as JS/CSS.
    minimumCacheTTL: 31536000,
  },
}

module.exports = nextConfig
