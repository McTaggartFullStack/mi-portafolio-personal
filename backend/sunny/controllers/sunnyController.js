/**
 * Sunny IA Assistant - Chat Controller
 * Handles incoming chat messages, validates input, and coordinates with IA layer
 */

const llmProvider = require('../ai/llmProvider'); // To be implemented (Paso 7)

/**
 * Handle incoming chat messages from frontend
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleChatMessage = async (req, res) => {
  try {
    // ========================================
    // 1. VALIDACIÓN DE ENTRADA
    // ========================================
    const { message, sessionId, metadata } = req.body;

    // Validar que message existe y no esté vacío
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'MESSAGE_REQUIRED',
        message: 'El mensaje no puede estar vacío.'
      });
    }

    // Validar longitud máxima del mensaje (evitar abuse)
    const MAX_MESSAGE_LENGTH = 5000;
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        ok: false,
        error: 'MESSAGE_TOO_LONG',
        message: `El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres.`
      });
    }

    // Validar sessionId si se proporciona
    if (sessionId && typeof sessionId !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'INVALID_SESSION_ID',
        message: 'El sessionId debe ser una cadena de texto.'
      });
    }

    // Preparar metadata por defecto si no se proporciona
    const userMetadata = metadata || {};
    if (typeof userMetadata !== 'object' || Array.isArray(userMetadata)) {
      return res.status(400).json({
        ok: false,
        error: 'INVALID_METADATA',
        message: 'La metadata debe ser un objeto válido.'
      });
    }

    // ========================================
    // 2. PREPARAR PAYLOAD PARA IA
    // ========================================
    const chatPayload = {
      userMessage: message.trim(),
      sessionId: sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        ...userMetadata,
        timestamp: new Date().toISOString(),
        channel: 'web'
      }
    };

    // ========================================
    // 3. LLAMAR A LA CAPA DE IA
    // ========================================
    // TODO: Paso 7 - Implementar llmProvider.generateResponse()
    // Por ahora, retorna respuesta mock (mantenedor de lugar)
    let aiResponse;
    try {
      aiResponse = await llmProvider.generateResponse(chatPayload);
    } catch (aiError) {
      console.error('IA Provider Error:', aiError);
      return res.status(aiError.statusCode || 503).json({
        ok: false,
        error: aiError.code || 'IA_SERVICE_UNAVAILABLE',
        message:
          aiError.message ||
          'El servicio de IA no está disponible en este momento. Intenta más tarde.'
      });
    }

    // ========================================
    // 4. CONSTRUIR RESPUESTA AL CLIENTE
    // ========================================
    const response = {
      ok: true,
      data: {
        response: aiResponse.response,
        sessionId: aiResponse.sessionId,
        confidence: aiResponse.confidence || 0.8,
        suggestedActions: aiResponse.suggestedActions || [],
        metadata: {
          processingTime: aiResponse.processingTime || 0,
          model: aiResponse.model || 'unknown'
        }
      },
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(response);

  } catch (error) {
    // ========================================
    // 5. MANEJO DE ERRORES
    // ========================================
    console.error('Chat Controller Error:', error);

    // Si no es un error conocido, retorna 500
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        ok: false,
        error: error.code || 'INTERNAL_ERROR',
        message: error.message || 'Error desconocido procesando tu mensaje.'
      });
    }

    // Error genérico del servidor
    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Ocurrió un error al procesar tu mensaje. Nuestro equipo ha sido notificado.'
    });
  }
};

/**
 * Health check endpoint for Sunny service
 */
const healthCheck = async (req, res) => {
  try {
    const isHealthy = await llmProvider.isHealthy();
    
    if (isHealthy) {
      return res.status(200).json({
        ok: true,
        message: 'Sunny IA assistant is healthy',
        timestamp: new Date().toISOString()
      });
    }

    return res.status(503).json({
      ok: false,
      message: 'Sunny IA assistant is degraded',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health Check Error:', error);
    return res.status(503).json({
      ok: false,
      message: 'Sunny IA assistant is unavailable',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  handleChatMessage,
  healthCheck
};
