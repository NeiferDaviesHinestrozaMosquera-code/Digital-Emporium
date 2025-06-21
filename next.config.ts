import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's1.1zoom.me',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // Added for Firebase Storage
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.forbes.com.mx', // Added for Forbes images
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kvmpay.com', // Added for kvmpay images
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gloriumtech.com', // Added for gloriumtech images
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hoffmannmurtaugh.com', // Added for hoffmannmurtaugh images
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.infintechdesigns.com', // Added for infintechdesigns images
        port: '',
        pathname: '/**',
      },
      { // Added for Supabase storage
        protocol: 'https',
        hostname: 'hoogjocezxaiysibtanl.supabase.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;