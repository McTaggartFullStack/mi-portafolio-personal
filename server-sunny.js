require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const sunnyRoutes = require('./routes/sunnyRoutes');

const app = express();
const PORT = process.env.SUNNY_PORT || process.env.PORT || 4000;

// Seguridad basica de cabeceras HTTP.
app.use(helmet());

// CORS configurable por variable de entorno.
app.use(
  cors({
    origin: process.env.SUNNY_CORS_ORIGIN || '*'
  })
);

// Limite de peticiones para reducir abuso y proteger costos de IA.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: 'Too many requests, please try again later.'
  }
});
app.use(limiter);

// Parseo de payloads JSON y formularios.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger simple para trazabilidad inicial.
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[SUNNY] ${now} ${req.method} ${req.originalUrl}`);
  next();
});

// Healthcheck del servidor principal.
app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'sunny-backend',
    timestamp: new Date().toISOString()
  });
});

// Rutas del asistente Sunny (sin relacion con FlorIA).
app.use('/api/sunny', sunnyRoutes);

// Handler para rutas no encontradas.
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Route not found'
  });
});

// Handler centralizado de errores.
app.use((err, req, res, next) => {
  console.error('[SUNNY_ERROR]', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    ok: false,
    error: message
  });
});

const server = app.listen(PORT, () => {
  console.log(`Sunny backend running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  console.error('[SUNNY_SERVER_ERROR]', error);
});

server.on('close', () => {
  console.error('[SUNNY_SERVER_CLOSE] HTTP server closed');
});

process.on('SIGINT', () => {
  console.log('[SUNNY] SIGINT recibido, cerrando servidor...');
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  console.log('[SUNNY] SIGTERM recibido, cerrando servidor...');
  server.close(() => process.exit(0));
});

process.on('uncaughtException', (error) => {
  console.error('[SUNNY_UNCAUGHT_EXCEPTION]', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('[SUNNY_UNHANDLED_REJECTION]', reason);
});
