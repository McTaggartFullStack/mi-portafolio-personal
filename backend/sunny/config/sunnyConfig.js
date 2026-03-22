/**
 * Sunny IA Assistant - Configuration File
 * 
 * IMPORTANT: This file imports dotenv and reads from the SAME .env file as FlorIA.
 * NO API KEY DUPLICATION: Both Sunny and FlorIA share the same GEMINI_API_KEY
 * 
 * Why no duplication?
 * - One .env file for the entire project
 * - Both services find "GEMINI_API_KEY" in that file
 * - No need for separate API keys
 * - Easier to manage and update
 */

require('dotenv').config();

// ========================================
// SHARED GEMINI API (No Duplication)
// ========================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Validate that API key is present
if (!GEMINI_API_KEY) {
  console.warn(
    '[SUNNY CONFIG] ⚠️  WARNING: GEMINI_API_KEY not found in .env file.\n' +
    'Add it to .env: GEMINI_API_KEY=your_key_here\n' +
    'Sunny and FlorIA will share this single API key.'
  );
}

// ========================================
// SUNNY IA SETTINGS
// ========================================
const sunnyConfig = {
  // ---- API Configuration ----
  gemini: {
    apiKey: GEMINI_API_KEY,
    model: process.env.GOOGLE_GEMINI_MODEL || 'gemini-2.5-flash'
  },

  // ---- Optional providers (future-ready) ----
  openai: {
    enabled: process.env.SUNNY_OPENAI_ENABLED === 'true',
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
  },

  // ---- Sunny Service Port ----
  port: parseInt(process.env.SUNNY_PORT) || 4000,
  corsOrigin: process.env.SUNNY_CORS_ORIGIN || '*',

  // ---- IA Model Parameters ----
  ai: {
    maxTokens: parseInt(process.env.SUNNY_MAX_TOKENS) || 1024,
    temperature: parseFloat(process.env.SUNNY_TEMPERATURE) || 0.7,
    timeoutMs: parseInt(process.env.SUNNY_TIMEOUT_MS) || 10000,
    retryAttempts: parseInt(process.env.SUNNY_RETRY_ATTEMPTS) || 2
  },

  // ---- System Prompt (Sunny Personality) ----
  systemPrompt: process.env.SUNNY_SYSTEM_PROMPT || `Eres Sunny, un asistente de IA amigable y profesional para WebsPTY.

Tu rol es:
1. Responder preguntas sobre servicios de SEO y desarrollo web
2. Demostrar los beneficios de mejorar el SEO (case: Nature Sunshine)
3. Ser empático y ofrecer soluciones reales
4. Agendar consultas cuando sea apropiado
5. Mantener un tono conversacional pero profesional

Responde en español. Sé conciso pero informativo (máximo 3 párrafos).
NO mezcles con asuntos de FlorIA o servicios internos.`,

  // ---- Logging ----
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    verbose: process.env.VERBOSE === 'true'
  },

  // ---- Environment ----
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

// ========================================
// VALIDATION & HELPER FUNCTIONS
// ========================================

/**
 * Check if Sunny is properly configured
 */
const isConfigured = () => {
  return !!sunnyConfig.gemini.apiKey;
};

/**
 * Decide primary provider based on current configuration
 */
const getPrimaryProvider = () => {
  if (sunnyConfig.gemini.apiKey) {
    return 'gemini';
  }

  if (sunnyConfig.openai.enabled && sunnyConfig.openai.apiKey) {
    return 'openai';
  }

  return null;
};

/**
 * Get configuration summary (for debugging)
 */
const getConfigSummary = () => {
  return {
    status: isConfigured() ? '✅ CONFIGURED' : '❌ NOT CONFIGURED',
    service: {
      port: sunnyConfig.port,
      corsOrigin: sunnyConfig.corsOrigin,
      environment: sunnyConfig.environment
    },
    ai: {
      provider: 'Google Gemini',
      model: sunnyConfig.gemini.model,
      apiKeyPresent: !!sunnyConfig.gemini.apiKey,
      apiKeySource: 'GEMINI_API_KEY from .env (shared with FlorIA)'
    },
    parameters: {
      maxTokens: sunnyConfig.ai.maxTokens,
      temperature: sunnyConfig.ai.temperature,
      timeoutMs: sunnyConfig.ai.timeoutMs
    }
  };
};

/**
 * Log configuration on startup
 */
const logConfiguration = () => {
  if (sunnyConfig.logging.verbose) {
    console.log('[SUNNY CONFIG]', JSON.stringify(getConfigSummary(), null, 2));
  } else {
    const summary = getConfigSummary();
    console.log(`[SUNNY] ${summary.status}`);
    console.log(`  Service: http://localhost:${sunnyConfig.port}`);
    console.log(`  IA Provider: ${summary.ai.provider} (${summary.ai.model})`);
    console.log(`  API Key Source: ${summary.ai.apiKeySource}`);
  }
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
  // Main config object
  ...sunnyConfig,

  // Helper functions
  isConfigured,
  getPrimaryProvider,
  getConfigSummary,
  logConfiguration

  // NOTE: GEMINI_API_KEY intentionally NOT exported
  // It's only used internally in services/sunnyAI.js
  // Never expose secrets via module.exports for security
};
