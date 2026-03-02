require('dotenv').config();
const express = require('express');
const validator = require('validator');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const logPath = path.join(__dirname, 'chat.log');
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';

// Sentry opcional
let Sentry;
if (process.env.SENTRY_DSN) {
  Sentry = require('@sentry/node');
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

function appendLog(message) {
  fs.appendFile(logPath, `${message}\n`, () => {});
}

// CORS
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: true }));
} else {
  const allowedOrigins = new Set([
    'https://www.webspty.dev',
    'https://webspty.dev',
  ]);

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
      res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-session-id');
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
}

if (Sentry?.Handlers?.requestHandler) {
  app.use(Sentry.Handlers.requestHandler());
}

// Forzar HTTPS en producción
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Seguridad
app.use(helmet());
app.use(express.json({ limit: '32kb' }));

// Rate limits
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res) {
    appendLog(`[${new Date().toISOString()}] RATE LIMIT | IP: ${req.ip}`);
    res.status(429).json({
      error: 'Límite de 5 mensajes por minuto alcanzado. Intenta nuevamente en 60 segundos.',
    });
  },
});

const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res) {
    appendLog(`[${new Date().toISOString()}] DAILY LIMIT | IP: ${req.ip}`);
    res.status(429).json({
      error: 'Límite diario de 30 mensajes alcanzado. Vuelve mañana o contáctame por WhatsApp al +507 6204-9480.',
    });
  },
});

// Endpoint para exponer sitekey segura al frontend
app.get('/api/recaptcha-sitekey', (req, res) => {
  if (!RECAPTCHA_SITE_KEY) {
    return res.status(404).json({ error: 'Sitekey no configurado.' });
  }
  return res.json({ sitekey: RECAPTCHA_SITE_KEY });
});

// Health check
app.get('/api/health', (req, res) => {
  return res.json({ ok: true, service: 'backend', ts: new Date().toISOString() });
});

// Ayuda para navegadores: /api/chat solo acepta POST
app.get('/api/chat', (req, res) => {
  return res.status(405).json({
    error: 'Método no permitido',
    detail: 'Usa POST /api/chat con JSON { history, recaptchaToken } y header x-session-id.',
  });
});

// Configuración IA
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const SYSTEM_INSTRUCTION = `
Eres FlorIA, asistente oficial de webspty. Tu misión: vender servicios con respuestas ultra-concisas.

REGLAS DE ORO:
- Máximo 20 palabras por respuesta a no ser que el usuario pregunte algo, ahí sí tu límite es mayor.
- No hablar del programa de afiliados salvo que lo pidan.
- Siempre termina con una pregunta relacionada.
- Solo respondes sobre webspty.dev. Si preguntan otra cosa, di que no puedes ayudar.

SERVICIOS Y PRECIOS:
- Tarjeta Digital: $125
- Landing page Express: $250
- Web Profesional: $480 (SEO + dominio .com gratis 1 año)
- E-commerce: $1250
- IA Extra: $350 implementación + $30/mes hosting exclusivo

MANTENIMIENTO:
Planes de $30, $50 y $90 mensuales.
- plan técnico: $30 incluye hosting asociado a tu dominio, actualizaciones de seguridad y soporte técnico.
- plan seguro: $50 incluye todo lo del plan técnico más optimizaciones de rendimiento, hosting propio de alto nivel y monitoreo proactivo.
- plan de crecimiento: $90 incluye todo lo del plan seguro más actualizaciones de hasta 3 secciones mensuales, hosting premium con recursos dedicados, plan de IA y soporte prioritario.
- plan de IA: $30 incluye el hosting de una inteligencia artificial dedicada al sitio web.

AFILIADOS (solo si preguntan):
- $20 por Tarjeta Digital
- $40 por Landing page Express
- $60 por Web Profesional

CONTACTO:
Carlos Mc Taggart | WhatsApp: +507 6204-9480
`;

function sanitizeMessage(msg) {
  if (typeof msg !== 'string') return '';
  let clean = validator.stripLow(msg, true);
  clean = clean.replace(/<script.*?>.*?<\/script>/gi, '');
  clean = clean.replace(/<[^>]+>/g, '');
  clean = validator.escape(clean);
  clean = validator.trim(clean);
  if (clean.length > 100) clean = clean.slice(0, 100);
  return clean;
}

function isValidHistory(arr) {
  if (!Array.isArray(arr)) return false;
  return arr.every((msg) =>
    (msg.role === 'user' || msg.role === 'model') &&
    Array.isArray(msg.parts) &&
    msg.parts.every((part) => typeof part.text === 'string')
  );
}

// Sesiones captcha con TTL
const SESSION_TTL_MS = 30 * 60 * 1000;
const validatedSessions = new Map();

function isSessionValidated(sessionId) {
  const expiresAt = validatedSessions.get(sessionId);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    validatedSessions.delete(sessionId);
    return false;
  }
  return true;
}

function markSessionValidated(sessionId) {
  validatedSessions.set(sessionId, Date.now() + SESSION_TTL_MS);
}

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, expiresAt] of validatedSessions.entries()) {
    if (expiresAt <= now) validatedSessions.delete(sessionId);
  }
}, 5 * 60 * 1000).unref();

app.post('/api/chat', dailyLimiter, chatLimiter, async (req, res) => {
  let { message, history, recaptchaToken } = req.body;
  const sessionId = req.headers['x-session-id'];

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no configurado en el servidor.' });
  }

  if (!sessionId || typeof sessionId !== 'string' || sessionId.length < 8 || sessionId.length > 200) {
    return res.status(400).json({ error: 'Falta el identificador de sesión.' });
  }

  if (!RECAPTCHA_SECRET) {
    return res.status(500).json({ error: 'reCAPTCHA no configurado en el servidor.' });
  }

  if (!isSessionValidated(sessionId)) {
    if (!recaptchaToken) {
      return res.status(400).json({ error: 'Falta el token de reCAPTCHA.' });
    }

    try {
      const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
      const body = new URLSearchParams({
        secret: RECAPTCHA_SECRET,
        response: recaptchaToken,
      }).toString();

      const verifyResp = await axios.post(verifyUrl, body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 8000,
      });

      if (!verifyResp?.data?.success) {
        return res.status(403).json({ error: 'No se pudo verificar el captcha. Intenta de nuevo.' });
      }

      markSessionValidated(sessionId);
    } catch (captchaErr) {
      appendLog(`[${new Date().toISOString()}] CAPTCHA ERROR | IP: ${req.ip} | ${captchaErr.message || captchaErr}`);
      return res.status(500).json({ error: 'Error al verificar el captcha.' });
    }
  }

  let normalizedHistory;

  if (!history || !isValidHistory(history)) {
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Falta el mensaje del usuario.' });
    }

    message = sanitizeMessage(message);
    if (!message.trim()) {
      return res.status(400).json({ error: 'El mensaje no es válido.' });
    }

    normalizedHistory = [
      { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION.trim() }] },
      { role: 'user', parts: [{ text: message }] },
    ];
  } else {
    normalizedHistory = history.map((msg) => {
      if (msg.role !== 'user') return msg;
      return {
        ...msg,
        parts: msg.parts.map((part) => ({ ...part, text: sanitizeMessage(part.text) })),
      };
    });

    const firstHistoryText = normalizedHistory?.[0]?.parts?.[0]?.text || '';
    if (firstHistoryText.trim() !== SYSTEM_INSTRUCTION.trim()) {
      normalizedHistory = [
        { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION.trim() }] },
        ...normalizedHistory,
      ];
    }

    if (normalizedHistory.length > 11) {
      normalizedHistory = [normalizedHistory[0], ...normalizedHistory.slice(-10)];
    }
  }

  try {
    const candidateModels = [GEMINI_MODEL];

    let response = null;
    let lastModelError = null;
    const lastText = normalizedHistory[normalizedHistory.length - 1]?.parts?.[0]?.text || '';

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName.startsWith('models/') ? modelName : `models/${modelName}` });
        const chat = model.startChat({ history: normalizedHistory.slice(0, -1) });
        const result = await chat.sendMessage(lastText);
        response =
          result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
          result?.response?.text?.() ||
          'No se pudo obtener respuesta.';
        break;
      } catch (modelErr) {
        lastModelError = modelErr;
      }
    }

    if (!response) {
      throw lastModelError || new Error('No hay modelos Gemini disponibles');
    }

    return res.json({ response });
  } catch (err) {
    appendLog(`[${new Date().toISOString()}] ERROR | IP: ${req.ip} | ${err.message || err.toString()}`);
    if (Sentry) Sentry.captureException(err);

    if (
      err?.status === 429 ||
      (err?.message && err.message.includes('429')) ||
      (err?.statusText && err.statusText.includes('Too Many Requests'))
    ) {
      return res.status(429).json({ error: 'Has alcanzado el límite de peticiones de la IA. Espera unos minutos y vuelve a intentarlo.' });
    }

    if (err?.message && /(model|gemini|not found|permission|quota|api key)/i.test(err.message)) {
      return res.status(500).json({ error: 'Gemini no disponible. Verifica API key, modelo permitido y cuota del proyecto.' });
    }

    return res.status(500).json({ error: 'Error al procesar la solicitud.' });
  }
});

if (Sentry?.Handlers?.errorHandler) {
  app.use(Sentry.Handlers.errorHandler());
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

process.on('unhandledRejection', (reason) => {
  appendLog(`[${new Date().toISOString()}] UNHANDLED_REJECTION | ${reason?.stack || reason}`);
});

process.on('uncaughtException', (err) => {
  appendLog(`[${new Date().toISOString()}] UNCAUGHT_EXCEPTION | ${err?.stack || err}`);
});
