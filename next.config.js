/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.BUILD_STANDALONE ? 'standalone' : undefined,
  distDir: 'out',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Não incluir chromadb no bundle do cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['chromadb']
  },
  images: {
    unoptimized: true
  },
  // Configuração para Electron
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined
}

module.exports = nextConfig 