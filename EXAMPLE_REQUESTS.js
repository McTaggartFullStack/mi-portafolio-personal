/**
 * Sunny IA Assistant - Example Requests & Responses
 * 
 * Test requests for the frontend to verify Sunny backend is working correctly.
 * Use these with curl, Postman, or your testing tool.
 * 
 * Server must be running: node server-sunny.js
 * Base URL: http://localhost:4000
 */

// ========================================
// EXAMPLE 1: Greeting Message
// ========================================
// User sends initial greeting to Sunny

const example1Request = {
  method: 'POST',
  url: 'http://localhost:4000/api/sunny/message',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    message: '¡Hola Sunny!',
    sessionId: null,  // null = new session (server will generate one)
    metadata: {
      device: 'mobile',
      userAgent: 'Mozilla/5.0...',
      referrer: '/nature-sunshine-demo3.html'
    }
  }
};

const example1Response = {
  ok: true,
  data: {
    response: '¡Hola! Soy Sunny, tu asistente de IA especializado en SEO y desarrollo web. ¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre cómo mejorar tu presencia online, estrategias de posicionamiento en buscadores, o cualquier aspecto de tu sitio web.',
    sessionId: 'session_1711025400000_a7f2k9',
    confidence: 0.95,
    suggestedActions: [
      {
        label: 'Ver Precios',
        action: 'view_pricing',
        priority: 'medium'
      }
    ],
    metadata: {
      processingTime: 487,
      model: 'gemini-1.5-flash'
    }
  },
  timestamp: '2026-03-21T10:30:00.000Z'
};

// ========================================
// EXAMPLE 2: SEO Question
// ========================================
// User asks specific question about SEO

const example2Request = {
  method: 'POST',
  url: 'http://localhost:4000/api/sunny/message',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    message: '¿Cómo puedo mejorar mi ranking en Google? Mi sitio web tiene poca visibilidad.',
    sessionId: 'session_1711025400000_a7f2k9',  // Continue conversation
    metadata: {
      device: 'desktop',
      userAgent: 'Mozilla/5.0...',
      isFirstTime: false  // User has interacted before
    }
  }
};

const example2Response = {
  ok: true,
  data: {
    response: 'Excelente pregunta. El ranking en Google depende de varios factores clave:\n\n1. **Estructura Técnica**: Tu sitio debe estar bien estructurado (SEO on-page), con títulos y meta descripciones optimizadas. Esto es lo que ayudó a Nature Sunshine a mejorar significativamente.\n\n2. **Contenido de Calidad**: Google valora contenido original, relevante y útil para los usuarios. Necesitas crear contenido que responda las preguntas de tu audiencia.\n\n3. **Backlinks**: Los enlaces desde otros sitios web confiables mejoran tu autoridad.\n\nEstos fueron exactamente los problemas que Nature Sunshine tenía antes de trabajar con WebsPTY. ¿Quieres conocer más detalles específicos para tu negocio?',
    sessionId: 'session_1711025400000_a7f2k9',
    confidence: 0.92,
    suggestedActions: [
      {
        label: 'Agendar Consulta',
        action: 'schedule_consultation',
        priority: 'high'
      },
      {
        label: 'Más Información',
        action: 'view_resources',
        priority: 'medium'
      }
    ],
    metadata: {
      processingTime: 523,
      model: 'gemini-1.5-flash'
    }
  },
  timestamp: '2026-03-21T10:31:15.000Z'
};

// ========================================
// EXAMPLE 3: Pricing Inquiry
// ========================================
// User asks about pricing and plans

const example3Request = {
  method: 'POST',
  url: 'http://localhost:4000/api/sunny/message',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    message: '¿Cuál es el costo de una consulta? Tengo un pequeño negocio.',
    sessionId: 'session_1711025400000_a7f2k9',
    metadata: {
      device: 'mobile',
      businessSize: 'small',
      budget: 'limited'
    }
  }
};

const example3Response = {
  ok: true,
  data: {
    response: 'Entiendo perfectamente. En WebsPTY ofrecemos diferentes planes adaptados al tamaño y necesidades de tu negocio:\n\n**Para pequeños negocios** tenemos opciones muy accesibles que incluyen análisis SEO inicial, recomendaciones y asesoría estratégica.\n\nLa primera consulta es una excelente forma de conocer exactamente qué necesita tu negocio. Cada empresa es diferente, así que el presupuesto varía según tus objetivos específicos.\n\n¿Te gustaría agendar una consulta inicial sin costo? Así podemos ver en detalle qué oportunidades tiene tu sitio web.',
    sessionId: 'session_1711025400000_a7f2k9',
    confidence: 0.93,
    suggestedActions: [
      {
        label: 'Agendar Consulta',
        action: 'schedule_consultation',
        priority: 'high'
      },
      {
        label: 'Ver Precios',
        action: 'view_pricing',
        priority: 'high'
      }
    ],
    metadata: {
      processingTime: 401,
      model: 'gemini-1.5-flash'
    }
  },
  timestamp: '2026-03-21T10:32:45.000Z'
};

// ========================================
// ERROR EXAMPLE: Invalid Message
// ========================================

const errorRequest = {
  method: 'POST',
  url: 'http://localhost:4000/api/sunny/message',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    message: '',  // INVALID: empty message
    sessionId: 'session_123'
  }
};

const errorResponse = {
  ok: false,
  error: 'MESSAGE_REQUIRED',
  message: 'El mensaje no puede estar vacío.',
  timestamp: '2026-03-21T10:33:00.000Z'
};

// ========================================
// HEALTH CHECK EXAMPLE
// ========================================

const healthCheckRequest = {
  method: 'GET',
  url: 'http://localhost:4000/api/sunny/health'
};

const healthCheckResponse = {
  ok: true,
  message: 'Sunny IA assistant is healthy',
  timestamp: '2026-03-21T10:30:00.000Z'
};

module.exports = {
  examples: {
    greeting: { request: example1Request, response: example1Response },
    seoQuestion: { request: example2Request, response: example2Response },
    pricingInquiry: { request: example3Request, response: example3Response },
    errorExample: { request: errorRequest, response: errorResponse },
    healthCheck: { request: healthCheckRequest, response: healthCheckResponse }
  }
};
