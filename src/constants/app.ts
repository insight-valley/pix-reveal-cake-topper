// Configurações gerais da aplicação
export const APP_CONFIG = {
  name: "PIX Reveal Cake Topper Generator",
  description: "Gerador de toppers de bolo personalizados usando IA",
  version: "1.0.0",
  author: "PIX Reveal",

  // Configurações de geração
  generation: {
    maxCharacters: 2000,
    defaultImageSize: "1024x1024",
    defaultQuality: "high",
    supportedFormats: ["PNG", "JPG", "SVG"] as const,
  },

  // Configurações de pagamento (somente para display, valor real é no backend)
  payment: {
    // Valor fixado no backend por segurança
    priceInCents: 100, // R$ 1,00 (mínimo AbacatePay)
    currency: "BRL",
  },

  // URLs e endpoints
  urls: {
    github: "https://github.com/pixreveal/cake-topper-generator",
    support: "mailto:support@pixreveal.com",
    privacy: "/privacy",
    terms: "/terms",
  },

  // Configurações de interface
  ui: {
    animation: {
      duration: 300,
      easing: "ease-in-out",
    },
    colors: {
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",
      accent: "hsl(var(--accent))",
    },
    breakpoints: {
      mobile: "640px",
      tablet: "768px",
      desktop: "1024px",
      widescreen: "1280px",
    },
  },

  // Funcionalidades ativas
  features: {
    promptCatalog: true,
    imageDownload: true,
    pwaInstall: true,
    offlineMode: true,
    socialSharing: false, // Pode ser implementado futuramente
    userProfiles: false, // Removido com a autenticação
    imageHistory: false, // Removido com a autenticação
  },
} as const;

// Mensagens padrão da aplicação
export const APP_MESSAGES = {
  success: {
    imageGenerated: "🎉 Seu topo de bolo está pronto!",
    promptSelected: "Receita de imagem selecionada!",
    imageSaved: "Imagem salva com sucesso!",
  },

  errors: {
    emptyText: "Por favor, descreva como você quer seu topo de bolo!",
    generationFailed:
      "Não conseguimos criar sua imagem agora. Tente novamente em alguns instantes.",
    networkError:
      "Sem conexão com a internet. Verifique sua rede e tente novamente.",
    invalidInput:
      "Sua descrição está muito longa. Use no máximo {max} caracteres.",
    apiError:
      "Serviço temporariamente indisponível. Tente novamente em alguns instantes.",
    serverError:
      "Ops! Algo deu errado ao criar sua imagem. Por favor, tente novamente. Se o problema continuar, entre em contato conosco.",
    openAIError:
      "Estamos com dificuldades técnicas temporárias. Tente novamente em alguns instantes. Se o problema continuar, entre em contato conosco.",
  },

  loading: {
    generating: "Criando seu topo personalizado...",
    loading: "Carregando...",
    processing: "Processando...",
  },

  placeholders: {
    promptInput:
      "Ex: Topo de bolo em estilo adesivo recortado, tema 'Parabéns Ana' 100% rosa...",
    search: "Buscar receitas por palavra-chave...",
  },
} as const;

// Configurações de SEO e Meta
export const SEO_CONFIG = {
  title: "Gerador de Topo de Bolo com IA",
  description:
    "Crie toppers de bolo personalizados com inteligência artificial. Designs únicos, alta qualidade e totalmente gratuito. Sem cadastro necessário!",
  keywords: [
    "topo de bolo",
    "cake topper",
    "personalizado",
    "IA",
    "inteligência artificial",
    "aniversário",
    "festa",
    "celebração",
    "design",
  ],
  ogImage: "/og-image.jpg",
  twitterCard: "summary_large_image",
} as const;

// Utilitários para validação
export const VALIDATION = {
  text: {
    minLength: 1,
    maxLength: APP_CONFIG.generation.maxCharacters,
  },

  prompt: {
    minLength: 10,
    maxLength: 5000,
  },
} as const;

// Tipos utilitários
export type AppFeature = keyof typeof APP_CONFIG.features;
export type AppMessage = keyof typeof APP_MESSAGES;
export type SupportedFormat =
  (typeof APP_CONFIG.generation.supportedFormats)[number];
