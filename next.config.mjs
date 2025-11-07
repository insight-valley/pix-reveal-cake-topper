/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Ensure app directory is enabled by default in Next 15
  },
  // TypeScript paths in tsconfig.json handle the @ alias, no webpack config needed
  
  // Configuração para Sharp na Vercel (necessário para processamento de imagens)
  images: {
    // Sharp é usado server-side, não precisa configurar aqui
    // Mas manteremos a configuração básica
  },
};

export default nextConfig;
