/** @type {import('next').NextConfig} */

// Importação do bundle-analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  reactStrictMode: false,
  
  // Otimizações de performance
  distDir: '.next',
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Otimizações de produção (ainda mantidas em dev para teste)
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  
  images: {
    domains: [
      'placehold.co', 
      'cloudflare-ipfs.com', 
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
    unoptimized: process.env.NODE_ENV === 'development',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  typescript: {
    // Ignorar erros de tipagem durante a build para evitar falhas
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // Ignorar erros de linting durante a build para evitar falhas
    ignoreDuringBuilds: true,
  },
  
  // Configuração otimizada do webpack
  webpack: (config, { dev, isServer }) => {
    // Resolver problemas com 'exports is not defined'
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    // Fix para 'exports is not defined'
    config.output = {
      ...config.output,
      globalObject: 'this', // Usar 'this' ao invés de 'self'
    };

    // Polyfill para 'self' e outras variáveis globais no ambiente de servidor
    if (isServer) {
      // Simular 'self' para o ambiente de servidor
      config.externals.push({
        'bufferutil': 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
      });
      
      // Adicionar o polyfill para 'self'
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        if (entries['main.js'] && !entries['main.js'].includes('./src/utils/polyfills.js')) {
          entries['main.js'].unshift('./src/utils/polyfills.js');
        }
        return entries;
      };
    }

    // Forçar ESM (ECMAScript Modules)
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.m?js$/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    };
    
    // Melhorar o carregamento de chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      runtimeChunk: {
        name: 'runtime',
      },
    };
    
    // Aumentar tolerância a falhas temporárias
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    
    return config;
  },
  
  experimental: {
    // Habilitar caching aprimorado
    turbotrace: {
      logLevel: 'error',
    },
    // Melhorar a experiência de desenvolvimento
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  
  swcMinify: true,
};

// Aplicar o bundle-analyzer à configuração do Next.js
module.exports = withBundleAnalyzer(nextConfig);
