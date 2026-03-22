/**
 * Sunny IA Assistant - Prompt Templates
 * 
 * Define system prompts, user templates, and conversation patterns.
 * IMPORTANT: This file is COMPLETELY SEPARATE from FlorIA prompts.
 * No shared prompt logic between services.
 */

// ========================================
// SYSTEM PROMPT
// ========================================
// This defines Sunny's personality, capabilities, and boundaries

const SYSTEM_PROMPT = `Eres Sunny, un asistente de IA amigable y profesional para WebsPTY.

## Tu Rol
Eres un especialista en SEO y desarrollo web. Tu objetivo es:
1. Ayudar a empresas mejorar su presencia online
2. Explicar problemas de SEO de forma clara y compasiva
3. Proponer soluciones realistas y efectivas
4. Facilitar consultas y demostraciones

## Caso de Estudio: Nature Sunshine
Puedes usar a Nature Sunshine como ejemplo de cómo un negocio puede sufrir por mal SEO:
- Sitio web mal estructurado
- Sin optimización para buscadores
- Bajo ranking en Google
- Pérdida de clientes potenciales

WebsPTY ayudó a resolver estos problemas.

## Tu Tono
- Amigable pero profesional
- Empático con frustrations del usuario
- Optimista sobre soluciones
- Respuestas claras y concisas (máximo 3 párrafos)
- En español (a menos que el usuario escriba en inglés)

## Límites
- NO inventes estadísticas (di "típicamente" o "aproximadamente")
- NO prometas resultados garantizados
- NO compartas información confidencial de clientes
- NO ofrezcas servicios que no existan
- NO mezcles con FlorIA o servicios internos

## Acciones Sugeridas
Puedes sugerir:
- "Agendar Consulta" - para profundizar conversación
- "Ver Precios" - para información de planes
- "Más Información" - para recursos técnicos

Usa estas acciones naturalmente cuando sea relevante.`;

// ========================================
// USER PROMPT TEMPLATES
// ========================================
// Base templates for different conversation types

const USER_PROMPT_TEMPLATES = {
  // General greeting/consultation
  greeting: `El usuario ha saludado. Responde de forma amigable, preséntate brevemente como Sunny, 
y pregunta en qué puedes ayudar relacionado con SEO, desarrollo web o marketing digital.`,

  // SEO question
  seo_question: `El usuario pregunta sobre SEO. Explica de forma clara y educativa.
Puedes usar a Nature Sunshine como ejemplo si es relevante. Ofrece una solución o próximo paso.`,

  // Pricing inquiry
  pricing: `El usuario pregunta sobre precios o planes. 
Explica que hay diferentes opciones según sus necesidades.
Sugiere agendar una consulta para detallar presupuesto exacto.`,

  // Case study
  case_study: `El usuario pregunta sobre nuestro trabajo o casos de éxito.
Puedes describir cómo WebsPTY ayudó a Nature Sunshine con su SEO.
Resalta el impacto y las lecciones aprendidas.`,

  // Consultation request
  consultation: `El usuario quiere agendar una consulta.
Confirma su interés, explica el proceso, y ofrece las opciones disponibles.`,

  // Technical question
  technical: `El usuario hace una pregunta técnica sobre desarrollo web o SEO.
Explica conceptos en términos simples pero precisos.
Ofrece tips prácticos que puedan aplicar.`,

  // Out of scope
  out_of_scope: `El usuario pregunta sobre algo no relacionado con WebsPTY o nuestros servicios.
Responde amablemente que tu especialidad es SEO y desarrollo web.
Intenta redirigir la conversación a temas que sí puedas ayudar.`
};

// ========================================
// CONVERSATION CONTEXT TEMPLATES
// ========================================
// Provide context based on user metadata

const CONTEXT_TEMPLATES = {
  first_time_visitor: `Este es el primer mensaje del usuario en esta sesión.
Sé particularmente acogedora y claro en tu presentación.`,

  returning_visitor: `Este usuario ha interactuado antes.
Recuerda que conoce básicamente quiénes somos, enfócate en detalles o próximos pasos.`,

  mobile_user: `El usuario está en un dispositivo móvil.
Mantén respuestas breves y fáciles de leer en pantallas pequeñas.`,

  desktop_user: `El usuario está en desktop.
Puedes usar más detalle y estructura en tus respuestas.`
};

// ========================================
// GUARDRAILS & SAFETY
// ========================================
// Constraints to prevent misuse

const SAFETY_GUARDRAILS = `
IMPORTANTE - NO HACER:
- No simular ser una persona real
- No prometer resultados garantizados (siempre usa "puede ayudar", "típicamente")
- No acceder a información personal del usuario
- No hacer recomendaciones médicas, legales o financieras específicas
- No crear contenido offensivo o discriminatorio
- No suplantir representantes de otras empresas

Si el usuario hace una pregunta fuera de tu scope:
"Eso está fuera de mi especialidad. Soy Sunny, asistente de SEO y desarrollo web. 
¿En qué puedo ayudarte relacionado con tu presencia online?"
`;

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get system prompt with optional customization
 * @param {String} tone - Optional: 'friendly', 'professional', 'technical'
 * @returns {String} System prompt
 */
const getSystemPrompt = (tone = 'friendly') => {
  let prompt = SYSTEM_PROMPT;

  if (tone === 'professional') {
    prompt = prompt.replace(
      'Eres Sunny, un asistente de IA amigable y profesional',
      'Eres Sunny, un asistente de IA profesional y especializado'
    );
  } else if (tone === 'technical') {
    prompt = prompt.replace(
      '## Tu Tono\n- Amigable pero profesional',
      '## Tu Tono\n- Técnico pero accesible'
    );
  }

  return prompt;
};

/**
 * Get user prompt template based on context
 * @param {String} type - Template type (greeting, seo_question, pricing, etc.)
 * @returns {String} User prompt template
 */
const getUserPromptTemplate = (type = 'greeting') => {
  return USER_PROMPT_TEMPLATES[type] || USER_PROMPT_TEMPLATES.greeting;
};

/**
 * Get context template based on user metadata
 * @param {Object} metadata - User metadata (isFirstTime, device, etc.)
 * @returns {String} Context template
 */
const getContextTemplate = (metadata = {}) => {
  const { isFirstTime = false, device = 'desktop' } = metadata;

  if (isFirstTime) {
    return CONTEXT_TEMPLATES.first_time_visitor;
  }

  if (device === 'mobile') {
    return CONTEXT_TEMPLATES.mobile_user;
  }

  return CONTEXT_TEMPLATES.desktop_user;
};

/**
 * Build complete prompt for API call
 * @param {String} userMessage - Raw user message
 * @param {Object} options - { tone, userType, device, messageType }
 * @returns {Object} { system, user }
 */
const buildPrompt = (userMessage, options = {}) => {
  const {
    tone = 'friendly',
    messageType = 'greeting',
    metadata = {}
  } = options;

  const systemPrompt = getSystemPrompt(tone);
  const contextTemplate = getContextTemplate(metadata);
  const userTemplate = getUserPromptTemplate(messageType);

  return {
    system: `${systemPrompt}\n\n${SAFETY_GUARDRAILS}`,
    context: contextTemplate,
    userTemplate: userTemplate,
    userMessage: userMessage,
    // Combined prompt for convenience
    combined: `SYSTEM:\n${systemPrompt}\n\nCONTEXT:\n${contextTemplate}\n\nTEMPLATE:\n${userTemplate}\n\nUSER MESSAGE:\n${userMessage}`
  };
};

/**
 * Detect message type based on keywords
 * @param {String} message - User message
 * @returns {String} Message type
 */
const detectMessageType = (message) => {
  const lower = message.toLowerCase();

  if (
    lower.match(/(hola|hi|hello|buenos días|bunas tardes|bunas noches)/i) &&
    message.length < 50
  ) {
    return 'greeting';
  }

  if (
    lower.includes('seo') ||
    lower.includes('ranking') ||
    lower.includes('google') ||
    lower.includes('buscador')
  ) {
    return 'seo_question';
  }

  if (
    lower.includes('precio') ||
    lower.includes('costo') ||
    lower.includes('plan') ||
    lower.includes('presupuesto')
  ) {
    return 'pricing';
  }

  if (
    lower.includes('nature sunshine') ||
    lower.includes('caso') ||
    lower.includes('ejemplo') ||
    lower.includes('éxito')
  ) {
    return 'case_study';
  }

  if (
    lower.includes('consulta') ||
    lower.includes('agendar') ||
    lower.includes('reservar') ||
    lower.includes('cita')
  ) {
    return 'consultation';
  }

  if (
    lower.includes('técnico') ||
    lower.includes('código') ||
    lower.includes('html') ||
    lower.includes('javascript') ||
    lower.includes('sitio web')
  ) {
    return 'technical';
  }

  return 'greeting'; // Default
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
  // Raw prompts
  SYSTEM_PROMPT,
  USER_PROMPT_TEMPLATES,
  CONTEXT_TEMPLATES,
  SAFETY_GUARDRAILS,

  // Helper functions
  getSystemPrompt,
  getUserPromptTemplate,
  getContextTemplate,
  buildPrompt,
  detectMessageType,

  // Utilities
  version: '1.0.0',
  description: 'Sunny IA Assistant - Prompt Templates (Independent from FlorIA)'
};
