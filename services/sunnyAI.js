/**
 * Sunny IA Assistant - AI Logic Service
 * Handles communication with LLM providers (Gemini, OpenAI, etc.)
 * Independent from FlorIA
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const sunnyConfig = require('../config/sunnyConfig');
const sunnyPrompts = require('../prompts/sunnyPrompts');

// ========================================
// INITIALIZATION
// ========================================

let geminiClient = null;
let openaiClient = null;

/**
 * Initialize IA providers based on config
 */
const initializeProviders = () => {
  try {
    if (sunnyConfig.isConfigured()) {
      geminiClient = new GoogleGenerativeAI(sunnyConfig.GEMINI_API_KEY);
      console.log('[SUNNY AI] Google Gemini initialized');
    }

    // TODO: Initialize OpenAI if needed in future
    // if (sunnyConfig.openai.enabled) {
    //   openaiClient = new OpenAI({ apiKey: sunnyConfig.openai.apiKey });
    //   console.log('[SUNNY AI] OpenAI initialized');
    // }
  } catch (error) {
    console.error('[SUNNY AI] Provider initialization error:', error.message);
  }
};

// Initialize on module load
initializeProviders();

// ========================================
// GOOGLE GEMINI HANDLER
// ========================================

/**
 * Call Google Gemini API for chat response
 * @param {String} userMessage - User input message
 * @param {Object} metadata - Additional context (sessionId, timestamp, etc.)
 * @returns {Promise<Object>} { response, confidence, processingTime, model }
 */
const callGemini = async (userMessage, metadata = {}) => {
  const startTime = Date.now();

  try {
    if (!geminiClient) {
      throw new Error('Gemini client not initialized. Check GOOGLE_GEMINI_API_KEY.');
    }

    const model = geminiClient.getGenerativeModel({
      model: sunnyConfig.gemini.model
    });

    // Build context-aware prompt using sunnyPrompts module
    const messageType = sunnyPrompts.detectMessageType(userMessage);
    const promptObj = sunnyPrompts.buildPrompt(userMessage, {
      tone: 'friendly',
      messageType: messageType,
      metadata: metadata
    });

    // Use system prompt from prompts module
    const systemPrompt = sunnyPrompts.getSystemPrompt('friendly');

    // Call Gemini with timeout
    const response = await Promise.race([
      model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUsuario: ${userMessage}` }] }
        ],
        generationConfig: {
          maxOutputTokens: sunnyConfig.ai.maxTokens,
          temperature: sunnyConfig.ai.temperature,
          topP: 0.95,
          topK: 40
        }
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Gemini request timeout')),
          sunnyConfig.ai.timeoutMs
        )
      )
    ]);

    // Extract response text
    const responseText = response.response.text();

    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    const processingTime = Date.now() - startTime;

    return {
      response: responseText.trim(),
      confidence: 0.95, // Gemini typically has high confidence
      processingTime,
      model: sunnyConfig.gemini.model,
      provider: 'gemini'
    };

  } catch (error) {
    // Log full error internally (dev only)
    if (process.env.NODE_ENV !== 'production') {
      console.error('[SUNNY AI] Gemini error:', error.message);
    }

    // Handle specific error types (don't expose internals in production)
    if (error.message.includes('timeout')) {
      throw {
        statusCode: 504,
        code: 'GEMINI_TIMEOUT',
        message: 'El servicio de IA tardó demasiado. Intenta nuevamente.'
      };
    }

    if (error.message.includes('401') || error.message.includes('API key')) {
      // Don't mention "API key" in production (security)
      throw {
        statusCode: 503,
        code: 'GEMINI_AUTH_ERROR',
        message: 'Error de autenticación con el servicio de IA.'
      };
    }

    if (error.message.includes('429')) {
      throw {
        statusCode: 429,
        code: 'GEMINI_RATE_LIMIT',
        message: 'Demasiadas solicitudes. Por favor, intenta en unos momentos.'
      };
    }

    if (error.message.includes('404') || error.message.includes('not found for API version')) {
      // Hide model name hint in production
      const hint = process.env.NODE_ENV === 'production' 
        ? ''
        : ' Ajusta GOOGLE_GEMINI_MODEL en .env a un modelo válido (ej. gemini-2.5-flash).';
      throw {
        statusCode: 503,
        code: 'GEMINI_MODEL_NOT_FOUND',
        message: 'El modelo configurado no está disponible.' + hint
      };
    }

    // Generic error (never expose internal details)
    throw {
      statusCode: 503,
      code: 'GEMINI_ERROR',
      message: 'Error al comunicarse con el servicio de IA. Intenta más tarde.'
    };
  }
};

// ========================================
// PUBLIC INTERFACE
// ========================================

/**
 * Generate AI response for user message
 * Automatically selects best available provider
 * @param {String} userMessage - User input
 * @param {Object} options - { metadata, provider }
 * @returns {Promise<Object>} AI response object
 */
const generateAIResponse = async (userMessage, options = {}) => {
  const { metadata = {}, provider = sunnyConfig.getPrimaryProvider() } = options;

  try {
    // Validate input
    if (!userMessage || typeof userMessage !== 'string') {
      throw {
        statusCode: 400,
        code: 'INVALID_MESSAGE',
        message: 'Message must be a non-empty string'
      };
    }

    // Route to appropriate provider
    if (provider === 'gemini' || provider === null) {
      return await callGemini(userMessage, metadata);
    }

    // Future: Add OpenAI routing
    // if (provider === 'openai') {
    //   return await callOpenAI(userMessage, metadata);
    // }

    throw {
      statusCode: 501,
      code: 'PROVIDER_NOT_IMPLEMENTED',
      message: `Provider "${provider}" not yet implemented`
    };

  } catch (error) {
    // Re-throw structured errors
    if (error.statusCode) {
      throw error;
    }

    // Wrap unexpected errors
    console.error('[SUNNY AI] Unexpected error:', error);
    throw {
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      message: 'Unexpected error generating response'
    };
  }
};

/**
 * Check if AI service is healthy
 * @returns {Promise<Boolean>}
 */
const isHealthy = async () => {
  try {
    if (sunnyConfig.isConfigured() && geminiClient) {
      // Simple test: try to get model info
      const model = geminiClient.getGenerativeModel({
        model: sunnyConfig.gemini.model
      });
      // If we got here without errors, consider it healthy
      return true;
    }

    return false;

  } catch (error) {
    console.error('[SUNNY AI] Health check error:', error.message);
    return false;
  }
};

/**
 * Get current configuration (for debugging)
 * @returns {Object} Current config (API key redacted)
 */
const getConfig = () => {
  return {
    providers: {
      gemini: {
        enabled: sunnyConfig.isConfigured(),
        model: sunnyConfig.gemini.model,
        apiKeyConfigured: !!sunnyConfig.GEMINI_API_KEY
      },
      openai: {
        enabled: sunnyConfig.openai.enabled,
        model: sunnyConfig.openai.model,
        apiKeyConfigured: !!sunnyConfig.openai.apiKey
      }
    },
    ai: {
      maxTokens: sunnyConfig.ai.maxTokens,
      temperature: sunnyConfig.ai.temperature,
      timeoutMs: sunnyConfig.ai.timeoutMs
    }
  };
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
  generateAIResponse,
  isHealthy,
  getConfig,
  // For testing/debugging
  callGemini,
  initializeProviders
};
