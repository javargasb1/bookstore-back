// bookstore-frontend/next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 👇 necesario para que Next genere .next/standalone
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig
