/**
 * Sunny IA Assistant - Configuration
 * Centralized environment variables and API credentials
 * Keep this file clean from FlorIA settings
 */

require('dotenv').config();

// ========================================
// API PROVIDER CONFIGURATION
// ========================================

const config = {
  // ---- GOOGLE GEMINI API ----
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || '',
    model: process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash',
    enabled: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY)
  },

  // ---- OPENAI API (Optional fallback) ----
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
    enabled: !!process.env.OPENAI_API_KEY
  },

  // ---- SUNNY ASSISTANT SETTINGS ----
  sunny: {
    name: 'Sunny',
    maxTokens: parseInt(process.env.SUNNY_MAX_TOKENS) || 1024,
    temperature: parseFloat(process.env.SUNNY_TEMPERATURE) || 0.7,
    systemPrompt: process.env.SUNNY_SYSTEM_PROMPT || `Eres Sunny, un asistente de IA amigable y profesional para WebsPTY.
Tu rol es:
1. Responder preguntas sobre servicios de SEO y desarrollo web
2. Demostrar los beneficios de mejorar el SEO
3. Ser empático y ofrecer soluciones reales
4. Agendar consultas cuando sea apropiado
5. Mantener un tono conversacional pero profesional

Responde en español excepto si el usuario pregunta en inglés.
Sé conciso pero informativo (máximo 3 párrafos).`,
    timeoutMs: parseInt(process.env.SUNNY_TIMEOUT_MS) || 10000,
    retryAttempts: parseInt(process.env.SUNNY_RETRY_ATTEMPTS) || 2
  },

  // ---- LOGGING & DEBUG ----
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    verbose: process.env.VERBOSE === 'true' || false
  }
};

// ========================================
// VALIDATION
// ========================================

/**
 * Validate that at least one AI provider is configured
 */
const validateProviders = () => {
  if (!config.gemini.enabled && !config.openai.enabled) {
    const error = new Error(
      'No AI provider configured. Set GOOGLE_GEMINI_API_KEY or OPENAI_API_KEY in .env'
    );
    console.warn('[SUNNY CONFIG] WARNING:', error.message);
    return false;
  }
  return true;
};

/**
 * Get the primary enabled provider
 */
const getPrimaryProvider = () => {
  if (config.gemini.enabled) return 'gemini';
  if (config.openai.enabled) return 'openai';
  return null;
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
  config,
  validateProviders,
  getPrimaryProvider,
  
  // Convenience accessors
  gemini: config.gemini,
  openai: config.openai,
  sunny: config.sunny,
  logging: config.logging
};
