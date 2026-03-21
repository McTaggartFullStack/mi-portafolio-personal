/**
 * Sunny IA Assistant - LLM Provider (Adapter Pattern)
 * Abstraction layer for AI/ML model integration
 * Delegates to service layer (sunnyAI.js for real calls)
 * Supports multiple providers without changing caller code
 */

const sunnyAI = require('../services/sunnyAI');

/**
 * Generate AI response based on user message
 * @param {Object} payload - Chat payload with userMessage, sessionId, metadata
 * @returns {Promise<Object>} AI response object
 */
const generateResponse = async (payload) => {
  try {
    const { userMessage, sessionId, metadata } = payload;

    // Call real IA service
    const aiResponse = await sunnyAI.generateAIResponse(userMessage, {
      metadata,
      provider: null // Use default/best provider
    });

    // Wrap AI response with session ID and suggested actions
    return {
      response: aiResponse.response,
      sessionId: sessionId,
      confidence: aiResponse.confidence || 0.85,
      suggestedActions: generateSuggestedActions(aiResponse.response),
      processingTime: aiResponse.processingTime,
      model: aiResponse.model,
      provider: aiResponse.provider
    };

  } catch (error) {
    console.error('[LLM Provider] Error:', error);
    
    // Re-throw structured errors from AI service
    if (error.statusCode) {
      throw error;
    }

    // Wrap unexpected errors
    throw {
      statusCode: 503,
      code: 'LLM_PROVIDER_ERROR',
      message: 'Error al comunicarse con el servicio de IA.'
    };
  }
};

/**
 * Check if LLM provider is healthy
 * @returns {Promise<Boolean>}
 */
const isHealthy = async () => {
  try {
    return await sunnyAI.isHealthy();
  } catch (error) {
    console.error('[LLM Provider] Health check error:', error);
    return false;
  }
};

/**
 * Generate suggested actions based on AI response
 * @param {String} response - AI response text
 * @returns {Array<Object>} Suggested action objects
 */
const generateSuggestedActions = (response) => {
  const actions = [];
  const lowerResponse = response.toLowerCase();

  // Smart action suggestions based on response content
  if (
    lowerResponse.includes('consulta') ||
    lowerResponse.includes('agendar') ||
    lowerResponse.includes('reunión')
  ) {
    actions.push({
      label: 'Agendar Consulta',
      action: 'schedule_consultation',
      priority: 'high'
    });
  }

  if (
    lowerResponse.includes('precio') ||
    lowerResponse.includes('costo') ||
    lowerResponse.includes('plan')
  ) {
    actions.push({
      label: 'Ver Precios',
      action: 'view_pricing',
      priority: 'high'
    });
  }

  if (
    lowerResponse.includes('seo') ||
    lowerResponse.includes('más información') ||
    lowerResponse.includes('saber más')
  ) {
    actions.push({
      label: 'Más Información',
      action: 'view_resources',
      priority: 'medium'
    });
  }

  return actions;
};

module.exports = {
  generateResponse,
  isHealthy
};
