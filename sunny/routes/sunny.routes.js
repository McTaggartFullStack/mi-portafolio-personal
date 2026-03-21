const express = require('express');

const router = express.Router();

// Endpoint base para verificar que las rutas de Sunny estan activas.
router.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    assistant: 'sunny',
    message: 'Sunny routes are running.'
  });
});

module.exports = router;
