/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  transpilePackages: ['lucide-react'],
  // Disable SWC for font loading to work with Babel
  swcMinify: false,
  webpack: (config) => {
    // Ignore specific modules that cause issues
    config.resolve.fallback = { 
      fs: false, 
      path: false,
      process: require.resolve('process/browser'),
    };
    
    // Add a rule to handle process in browser
    config.module.rules.push({
      test: /node_modules\/process\/browser\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-modules-commonjs'],
        },
      },
    });
    
    return config;
  },
  // Disable font optimization to avoid conflicts with Babel
  optimizeFonts: false,
}

module.exports = nextConfig
