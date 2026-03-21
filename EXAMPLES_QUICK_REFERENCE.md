# Sunny IA Assistant - Quick Reference: 3 Request Examples

## 🚀 Quick Start

**Terminal 1:**
```bash
cd /Users/mctaggartspirit/Desktop/webspty
node server-sunny.js
```

**Terminal 2:**
```bash
bash test_sunny_api.sh
```

Or use the manual examples below with cURL or JavaScript.

---

## 📌 Example 1: Greeting (New Session)

What the user says: **"¡Hola Sunny!"**

### cURL Command
```bash
curl -X POST http://localhost:4000/api/sunny/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¡Hola Sunny!",
    "sessionId": null,
    "metadata": {"device": "mobile"}
  }' | jq
```

### JavaScript
```javascript
const response = await fetch('http://localhost:4000/api/sunny/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '¡Hola Sunny!',
    sessionId: null,
    metadata: { device: 'mobile' }
  })
});
const data = await response.json();
console.log(data.data.response);  // Sunny's greeting
console.log(data.data.sessionId); // Save this for next message
```

### What Happens
```
1. Frontend sends greeting
2. Server detects message type → "greeting"
3. Uses greeting template + system prompt
4. Calls Gemini
5. Returns response + NEW sessionId
6. Includes suggested action: "Ver Precios"
```

### Expected Response
```json
{
  "ok": true,
  "data": {
    "response": "¡Hola! Soy Sunny, tu asistente de IA especializado en SEO y desarrollo web. ¿En qué puedo ayudarte hoy?",
    "sessionId": "session_1711025400000_a7f2k9",
    "confidence": 0.95,
    "suggestedActions": [
      {"label": "Ver Precios", "action": "view_pricing", "priority": "medium"}
    ],
    "metadata": {"processingTime": 487, "model": "gemini-1.5-flash"}
  },
  "timestamp": "2026-03-21T10:30:00.000Z"
}
```

---

## 🔍 Example 2: SEO Question (Continue Session)

What the user says: **"¿Cómo puedo mejorar mi ranking en Google?"**

### cURL Command
```bash
# Use the sessionId from Example 1
curl -X POST http://localhost:4000/api/sunny/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cómo puedo mejorar mi ranking en Google?",
    "sessionId": "session_1711025400000_a7f2k9",
    "metadata": {"device": "desktop"}
  }' | jq
```

### JavaScript
```javascript
const sessionId = "session_1711025400000_a7f2k9"; // From Example 1

const response = await fetch('http://localhost:4000/api/sunny/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '¿Cómo puedo mejorar mi ranking en Google?',
    sessionId: sessionId,  // IMPORTANT: Same session ID
    metadata: { device: 'desktop' }
  })
});
const data = await response.json();
console.log(data.data.response);     // Technical SEO answer
console.log(data.data.suggestedActions); // [Agendar, Más Info]
```

### What Happens
```
1. Frontend sends SEO question with SAME sessionId
2. Server detects message type → "seo_question"
3. Uses SEO template + system prompt + session context
4. Calls Gemini
5. Gemini generates technical answer
6. References Nature Sunshine case study
7. Generates smart suggested actions based on keywords
```

### Expected Response
```json
{
  "ok": true,
  "data": {
    "response": "Excelente pregunta. El ranking en Google depende de varios factores clave:\n\n1. **Estructura Técnica**: Tu sitio debe estar bien estructurado (SEO on-page), con títulos y meta descripciones optimizadas. Esto es lo que ayudó a Nature Sunshine a mejorar significativamente.\n\n2. **Contenido de Calidad**: Google valora contenido original, relevante y útil. Necesitas crear contenido que responda preguntas de tu audiencia.\n\n3. **Backlinks**: Enlaces desde sitios confiables mejoran tu autoridad. ¿Quieres saber más detalles?",
    "sessionId": "session_1711025400000_a7f2k9",
    "confidence": 0.92,
    "suggestedActions": [
      {"label": "Agendar Consulta", "action": "schedule_consultation", "priority": "high"},
      {"label": "Más Información", "action": "view_resources", "priority": "medium"}
    ],
    "metadata": {"processingTime": 523, "model": "gemini-1.5-flash"}
  },
  "timestamp": "2026-03-21T10:31:15.000Z"
}
```

---

## 💰 Example 3: Pricing Question (Continue Session)

What the user says: **"¿Cuál es el precio para pequeños negocios?"**

### cURL Command
```bash
curl -X POST http://localhost:4000/api/sunny/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuál es el costo de una consulta? Tengo un pequeño negocio.",
    "sessionId": "session_1711025400000_a7f2k9",
    "metadata": {"device": "mobile", "businessSize": "small"}
  }' | jq
```

### JavaScript
```javascript
const sessionId = "session_1711025400000_a7f2k9"; // From Example 1

const response = await fetch('http://localhost:4000/api/sunny/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '¿Cuál es el costo de una consulta? Tengo un pequeño negocio.',
    sessionId: sessionId,
    metadata: {
      device: 'mobile',
      businessSize: 'small',
      budget: 'limited'
    }
  })
});
const data = await response.json();
console.log(data.data.response);     // Flexible pricing answer
console.log(data.data.suggestedActions); // Both "Agendar" and "Ver Precios"
```

### What Happens
```
1. Frontend sends pricing question with session context
2. Server detects message type → "pricing"
3. Uses pricing template + system prompt
4. Calls Gemini with budget context
5. Gemini generates empathetic, budget-friendly response
6. Auto-generates both pricing and scheduling actions
7. No pushy sales language (Sunny's personality)
```

### Expected Response
```json
{
  "ok": true,
  "data": {
    "response": "Entiendo perfectamente. En WebsPTY ofrecemos diferentes planes adaptados al tamaño y necesidades de tu negocio:\n\n**Para pequeños negocios** tenemos opciones muy accesibles que incluyen análisis SEO inicial, recomendaciones y asesoría estratégica.\n\nLa primera consulta es una excelente forma de conocer exactamente qué necesita tu negocio. Si quieres, podemos agendar una llamada sin costo para analizar tu situación actual.",
    "sessionId": "session_1711025400000_a7f2k9",
    "confidence": 0.93,
    "suggestedActions": [
      {"label": "Agendar Consulta", "action": "schedule_consultation", "priority": "high"},
      {"label": "Ver Precios", "action": "view_pricing", "priority": "high"}
    ],
    "metadata": {"processingTime": 401, "model": "gemini-1.5-flash"}
  },
  "timestamp": "2026-03-21T10:32:45.000Z"
}
```

---

## 📊 Comparison Table

| Aspect | Example 1 | Example 2 | Example 3 |
|--------|-----------|-----------|-----------|
| **Message** | "¡Hola Sunny!" | "¿Cómo mejorar mi ranking?" | "¿Cuál es el precio?" |
| **Type Detected** | greeting | seo_question | pricing |
| **SessionId** | Generated | Same (continue) | Same (continue) |
| **Response Length** | 150 words | 200+ words | 150 words |
| **Confidence** | 0.95 | 0.92 | 0.93 |
| **Processing Time** | 487ms | 523ms | 401ms |
| **Actions Suggested** | 1 (Precios) | 2 (Agendar + Info) | 2 (Agendar + Precios) |
| **Nature Sunshine Ref** | No | Yes (detailed) | No |

---

## 🔧 Key Points

### Session Management
```javascript
// First message: no sessionId (null or omit)
sessionId: null

// Get back: sessionId in response.data.sessionId
sessionId_returned: "session_1711025400000_a7f2k9"

// All next messages: USE SAME sessionId to maintain context
sessionId: "session_1711025400000_a7f2k9"
```

### Message Type Detection (Automatic)
```
"hola", "hi", "hello" → greeting
"seo", "ranking", "google", "buscador" → seo_question
"precio", "costo", "plan", "presupuesto" → pricing
"consulta", "agendar", "reunión" → consultation
"html", "código", "técnico", "sitio web" → technical
```

### Suggested Actions
```javascript
[
  {
    "label": "Label shown to user",
    "action": "action_code_for_frontend",
    "priority": "high" | "medium" | "low"
  }
]
```

---

## ✅ Test Sequence

1. **Start server** → See "[SUNNY] Express server listening on port 4000"
2. **Send Example 1** → Get sessionId
3. **Save sessionId from response**
4. **Send Example 2 with that sessionId** → Multi-turn conversation works
5. **Send Example 3 with that sessionId** → Session continues
6. **Verify** → All responses have ok: true, confidence > 0.8

---

## 🎯 Verification

After running examples:

- ✓ Server didn't crash
- ✓ All responses have `ok: true`
- ✓ Responses include `sessionId` (for multi-turn)
- ✓ Message types detected correctly
- ✓ Suggested actions are relevant
- ✓ Processing time is reasonable (<1s)
- ✓ Confidence scores are high (>0.85)
- ✓ Responses reference Nature Sunshine appropriately

---

## 📚 More Information

For detailed information including:
- All available endpoints
- Error responses
- Rate limiting
- Troubleshooting
- Advanced features

→ See **[TESTING_GUIDE.md](TESTING_GUIDE.md)**

For the full test automation script:
→ See **[test_sunny_api.sh](test_sunny_api.sh)**

For JavaScript object format:
→ See **[EXAMPLE_REQUESTS.js](EXAMPLE_REQUESTS.js)**
