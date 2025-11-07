// Re-export all constants for easy importing
export * from "./app";
export * from "./prompts";
export * from "./styles";

// Common constant combinations
export { EXAMPLE_TEXTS, PROMPT_CATALOG, PROMPT_CATEGORIES } from "./prompts";
export { APP_CONFIG, APP_MESSAGES, SEO_CONFIG, VALIDATION } from "./app";
export { STYLES, buildClasses, getResponsiveSize } from "./styles";
