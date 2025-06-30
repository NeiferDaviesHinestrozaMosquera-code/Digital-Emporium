/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuración para manejar las rutas dinámicas de idioma
  trailingSlash: false,
  
  // Configuración experimental para mejorar el manejo de rutas dinámicas
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Configuración para generación estática
  output: 'standalone', // Opcional: para despliegue en contenedores
  
  // Configuración de imágenes
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
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.forbes.com.mx',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kvmpay.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gloriumtech.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hoffmannmurtaugh.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.infintechdesigns.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hoogjocezxaiysibtanl.supabase.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
  
  // Configuración de webpack para manejar mejor las dependencias
  webpack: (config, { dev, isServer }) => {
    // Configuración para manejar OpenTelemetry warnings
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/@opentelemetry/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: []
        }
      }
    });
    
    // Configuración para manejar Handlebars warnings
    config.resolve.alias = {
      ...config.resolve.alias,
      handlebars: 'handlebars/dist/handlebars.min.js'
    };
    
    return config;
  },
  
  // Configuración para generación de sitemap
  async generateBuildId() {
    return `build-${Date.now()}`;
  },
};

module.exports = nextConfig;
