const express = require('express');
const { handleChatMessage, healthCheck } = require('../controllers/sunnyController');

const router = express.Router();

// Health check endpoint for Sunny service
router.get('/health', healthCheck);

// Chat message endpoint - process user messages
router.post('/message', handleChatMessage);

module.exports = router;
