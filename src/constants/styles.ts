// Constantes de estilo e design
export const STYLES = {
  // Animações customizadas
  animations: {
    fadeIn: "animate-fade-in",
    bounceEnter: "animate-bounce-soft",
    pulseHeartbeat: "animate-pulse-slow",
    scaleHover: "hover:scale-105",
    scalePress: "active:scale-95",
  },

  // Gradientes padronizados
  gradients: {
    background: "bg-gradient-subtle",
    primary: "bg-gradient-primary",
    accent: "bg-gradient-accent",
    card: "bg-gradient-to-br from-background to-muted",
  },

  // Sombras customizadas
  shadows: {
    soft: "shadow-soft",
    card: "shadow-lg shadow-primary/10",
    button: "shadow-md hover:shadow-lg",
    image: "shadow-xl shadow-black/20",
  },

  // Bordas e contornos
  borders: {
    primary: "border-2 border-primary/10 hover:border-primary/30",
    card: "border border-primary/20",
    input: "border-2 border-primary/20 focus:border-primary",
    image: "border-2 border-dashed border-primary/30",
  },

  // Tamanhos padronizados
  sizes: {
    icon: {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
    },
    avatar: {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-16 h-16",
      xl: "w-20 h-20",
    },
    container: {
      xs: "max-w-sm",
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
      "2xl": "max-w-6xl",
    },
  },

  // Grid layouts comuns
  grids: {
    responsive: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
    prompts: "grid md:grid-cols-2 lg:grid-cols-3 gap-4",
    features: "grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6",
    cards: "grid grid-cols-1 md:grid-cols-2 gap-6",
  },

  // Estados interativos
  interactive: {
    button: "transition-all duration-300 hover:scale-105 active:scale-95",
    card: "transition-all duration-300 hover:shadow-soft hover:scale-[1.02]",
    badge: "transition-transform hover:scale-105",
    input: "transition-colors duration-200",
  },

  // Tipografia
  typography: {
    heading: {
      xl: "text-3xl sm:text-4xl md:text-5xl font-bold",
      lg: "text-2xl sm:text-3xl font-bold",
      md: "text-xl sm:text-2xl font-semibold",
      sm: "text-lg font-semibold",
    },
    body: {
      lg: "text-base sm:text-lg",
      md: "text-sm sm:text-base",
      sm: "text-xs sm:text-sm",
    },
    gradient: "bg-gradient-primary bg-clip-text text-transparent",
  },

  // Layouts responsivos
  responsive: {
    container: "container mx-auto px-4 sm:px-6",
    section: "py-6 sm:py-8",
    card: "p-4 sm:p-6",
    spacing: "space-y-4 sm:space-y-6",
    gap: "gap-4 sm:gap-6",
  },
} as const;

// Utilitários para construir classes CSS
export const buildClasses = (
  ...classes: (string | undefined | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

export const getResponsiveSize = (size: "sm" | "md" | "lg") => {
  const sizeMap = {
    sm: "w-4 h-4 sm:w-5 sm:h-5",
    md: "w-5 h-5 sm:w-6 sm:h-6",
    lg: "w-6 h-6 sm:w-8 sm:h-8",
  };
  return sizeMap[size];
};

// Tipos úteis
export type AnimationType = keyof typeof STYLES.animations;
export type GradientType = keyof typeof STYLES.gradients;
export type ShadowType = keyof typeof STYLES.shadows;
