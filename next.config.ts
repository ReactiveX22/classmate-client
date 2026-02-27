import type { NextConfig } from 'next';

const apiUrl = process.env.API_URL || 'http://backend:3000';
const { protocol, hostname, port } = new URL(apiUrl);

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: protocol.replace(':', '') as 'http' | 'https',
        hostname,
        port: port || '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
