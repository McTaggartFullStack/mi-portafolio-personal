require('dotenv').config();
const express = require('express');
const validator = require('validator');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const logPath = path.join(__dirname, 'chat.log');


// 6. Monitorización de errores con Sentry (opcional)
let Sentry;
if (process.env.SENTRY_DSN) {
  Sentry = require('@sentry/node');
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

const app = express();
// Endpoint para obtener el sitekey de reCAPTCHA de forma segura
app.get('/api/recaptcha-sitekey', (req, res) => {
  const sitekey = process.env.RECAPTCHA_SITE_KEY || '';
  if (!sitekey) {
    return res.status(404).json({ error: 'Sitekey no configurado' });
  }
  res.json({ sitekey });
});
if (Sentry) {
  app.use(Sentry.Handlers.requestHandler());
}

// 4. HTTPS obligatorio en producción
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

// 1. Configuraciones de seguridad
app.use(helmet());
app.use(express.json());

// 2. CORS (Permitiendo tus puertos locales y tu dominio)
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5502',
  'http://localhost:5500',
  'http://localhost:5502',
  'https://www.webspty.dev',
  'https://webspty.dev',
  'http://webspty.dev',
  'http://www.webspty.dev',
  'webspty.dev',
  'www.webspty.dev',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
}));

// 3. Rate Limit (10 mensajes cada 2 minutos)
const chatLimiter = rateLimit({
  windowMs: 2 * 60 * 10, 
  max: 100,
  handler: function (req, res) {
    // Log rate limit event
    const logEntry = `[${new Date().toISOString()}] RATE LIMIT | IP: ${req.ip}\n`;
    fs.appendFile(logPath, logEntry, () => {});
    res.status(429).json({ error: 'Límite de 5 mensajes por minuto alcanzado. Esto asegura respuestas óptimas y sin demoras. En 60 segundos continuamos. Gracias por la comprensión. 😌 Alternativa: mctaggart.dev@gmail.com' });
  }
});

// Rate limit diario por IP (30 mensajes por día)
const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 30,
  handler: function (req, res) {
    const logEntry = `[${new Date().toISOString()}] DAILY LIMIT | IP: ${req.ip}\n`;
    fs.appendFile(logPath, logEntry, () => {});
    res.status(429).json({ error: 'Límite diario de 30 mensajes alcanzado. Vuelve mañana o contáctame por WhatsApp al +507 6204-9480 o Gmail mctaggart.dev@gmail.com.' });
  }
});

// 4. Inicialización de Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
Eres FlorIA, asistente oficial de webspty Tu misión: vender servicios con respuestas ultra-concisas.

REGLAS DE ORO:
- Máximo 20 palabras por respuesta a no ser que el usuario pregunte algo, ahi si tu limite es mayor.
- No hablar del programa de afiliados salvo que lo pidan.
- Siempre termina con una pregunta relacionada.
- Solo respondes sobre webspty.dev. Si preguntan otra cosa, di que no puedes ayudar.

SERVICIOS Y PRECIOS:
- Tarjeta Digital: $125
- Landing page Express: $250
- Web Profesional: $480 (SEO + dominio .com gratis 1 año)
- E-commerce: $1250
- IA Extra: $150 implementación + $30/mes hosting exclusivo

MANTENIMIENTO:
Planes de $30, $50 y $90 mensuales.
 -plan tecnico: 30$ incluye hoosting asociado a tu dominio, actualizaciones de seguridad y soporte técnico.
 -plan seguro: 50$ incluye todo lo del plan técnico más optimizaciones de rendimiento, hosting propio de alto nivel y monitoreo proactivo.
 -plan de crecimiento: 90$ incluye todo lo del plan seguro mas actualizaciones de hasta 3 secciones mensuales, hosting premium con recursos dedicados, plan de IA y soporte prioritario.
 -plan de IA: 30$ incluye el hosting de una inteligencia artificial dedicada al sitio web

AFILIADOS (solo si preguntan):
- $20 por Tarjeta Digital
- $40 por Landing page Express
- $60 por Web Profesional
- Pago inmediato: efectivo, transferencia o yappy


CONTACTO:
Carlos Mc Taggart | WhatsApp: +507 6204-9480
`;


// Utilidad para limpiar el mensaje
function sanitizeMessage(msg) {
  if (typeof msg !== 'string') return '';
  // Limpiar HTML, eliminar scripts, filtrar caracteres peligrosos y normalizar espacios
  let clean = validator.stripLow(msg, true);
  clean = validator.escape(clean);
  clean = clean.replace(/<script.*?>.*?<\/script>/gi, '');
  clean = validator.trim(clean);
  // Limitar tamaño
  if (clean.length > 100) {
    clean = clean.slice(0, 100);
  }
  return clean;
}

// 5. RUTA DEL CHAT (Con sistema de reintento automático y validación reCAPTCHA)
const axios = require('axios');
const RECAPTCHA_SECRET = '6LfKqm8sAAAAAN7Kakn9lPSRiyaMjze3WPo38JWr';
// Simple in-memory session validation store
const validatedSessions = {};

app.post('/api/chat', dailyLimiter, chatLimiter, async (req, res) => {
  let { message, history, recaptchaToken } = req.body;
  // Session ID from header (frontend must send this)
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    return res.status(400).json({ error: 'Falta el identificador de sesión.' });
  }
  // Only require captcha if session is not validated
  if (!validatedSessions[sessionId]) {
    if (!recaptchaToken) {
      return res.status(400).json({ error: 'Falta el token de reCAPTCHA.' });
    }
    try {
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`;
      const verifyResp = await axios.post(verifyUrl);
      if (!verifyResp.data.success) {
        return res.status(403).json({ error: 'No se pudo verificar el captcha. Intenta de nuevo.' });
      }
      // Mark session as validated
      validatedSessions[sessionId] = true;
    } catch (captchaErr) {
      return res.status(500).json({ error: 'Error al verificar el captcha.' });
    }
  }

  // ...existing code...
  // message: string (optional, for legacy)
  // history: array of { role: 'user'|'model', parts: [{ text: string }] }
  // 8. Validación de estructura de history
  function isValidHistory(arr) {
    if (!Array.isArray(arr)) return false;
    return arr.every(msg =>
      (msg.role === 'user' || msg.role === 'model') &&
      Array.isArray(msg.parts) &&
      msg.parts.every(part => typeof part.text === 'string')
    );
  }
  if (!history || !isValidHistory(history)) {
    // Fallback: legacy single-message mode
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Falta el mensaje del usuario.' });
    }
    message = sanitizeMessage(message);
    if (!message.trim()) {
      return res.status(400).json({ error: 'El mensaje no es válido.' });
    }
    if (message.length > 100) {
      return res.status(400).json({ error: 'El mensaje es demasiado largo. Máximo 100 caracteres.' });
    }
    history = [
      { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION }] },
      { role: 'user', parts: [{ text: message }] }
    ];
  } else {
    // Sanitize all user messages in history
    history = history.map((msg, idx) => {
      if (msg.role === 'user' && msg.parts && Array.isArray(msg.parts)) {
        return {
          ...msg,
          parts: msg.parts.map(part => {
            let sanitized = sanitizeMessage(part.text);
            if (sanitized.length > 100) {
              sanitized = sanitized.slice(0, 100);
            }
            return { ...part, text: sanitized };
          })
        };
      }
      return msg;
    });
    // Always prepend SYSTEM_INSTRUCTION as the first message
    if (!history.length || history[0].parts[0].text !== SYSTEM_INSTRUCTION.trim()) {
      history = [
        { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION.trim() }] },
        ...history
      ];
    }
    // Limit to last 10 messages (excluding SYSTEM_INSTRUCTION)
    if (history.length > 11) {
      history = [history[0], ...history.slice(-10)];
    }
  }
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(history[history.length - 1].parts[0].text);
    const response = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo obtener respuesta.';
    res.json({ response });
  } catch (err) {
    // Log error event
    const logEntry = `[${new Date().toISOString()}] ERROR | IP: ${req.ip} | ${err.message || err.toString()}\n`;
    fs.appendFile(logPath, logEntry, () => {});
    if (Sentry) Sentry.captureException(err);
    console.error('Error en /api/chat:', err);
    // Manejo específico para errores de cuota/429
    if (err.status === 429 || (err.message && err.message.includes('429')) || (err.statusText && err.statusText.includes('Too Many Requests'))) {
      return res.status(429).json({ error: 'Has alcanzado el límite de peticiones de la IA. Espera unos minutos y vuelve a intentarlo.' });
    }
    if (err.message && err.message.includes('models/gemini-pro')) {
      return res.status(500).json({ error: 'El modelo Gemini no está disponible. Por favor, revisa tu clave o cuota.' });
    }
    res.status(500).json({ error: 'Error al procesar la solicitud.' });
  }
if (Sentry) {
  app.use(Sentry.Handlers.errorHandler());
}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`-----------------------------------------`);
  console.log(`🚀 FlorIA Backend escuchando en puerto ${PORT}`);
  console.log(`🔑 API KEY: ${process.env.GEMINI_API_KEY ? 'CONFIGURADA' : 'FALTA'}`);
  // 5. Advertencia de dependencias desactualizadas
  try {
    const { execSync } = require('child_process');
    const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
    if (outdated && outdated !== '{}') {
      console.warn('⚠️ Dependencias desactualizadas detectadas. Ejecuta "npm update" para mejorar seguridad.');
    }
  } catch (e) {
    // Silenciar errores si npm outdated falla
  }
  console.log(`-----------------------------------------`);
});
