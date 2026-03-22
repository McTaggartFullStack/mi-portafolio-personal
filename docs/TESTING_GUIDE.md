# Sunny IA Assistant - Testing Examples

## Prerequisites

1. **Start the server:**
```bash
cd /Users/mctaggartspirit/Desktop/webspty
node server-sunny.js
```

You should see:
```
[SUNNY] 2026-03-21T10:30:00.000Z Express server listening on port 4000
```

2. **Verify API key is configured:**
```bash
echo $GEMINI_API_KEY
# Should output: YOUR_GEMINI_API_KEY
```

---

## Example 1: Greeting Message (First Contact)

**What happens:**
- User opens chatbot and says hello
- Server generates new sessionId
- Sunny responds with friendly greeting

### Using cURL

```bash
curl -X POST http://localhost:4000/api/sunny/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¡Hola Sunny!",
    "sessionId": null,
    "metadata": {
      "device": "mobile",
      "userAgent": "Mozilla/5.0",
      "referrer": "/nature-sunshine-demo3.html"
    }
  }' | jq
```

### Using JavaScript (Fetch)

```javascript
// In browser console or Node.js

const response = await fetch('http://localhost:4000/api/sunny/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: '¡Hola Sunny!',
    sessionId: null,
    metadata: {
      device: 'mobile',
      userAgent: navigator.userAgent,
      referrer: window.location.href
    }
  })
});

const data = await response.json();
console.log(data);
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
      {
        "label": "Ver Precios",
        "action": "view_pricing",
        "priority": "medium"
      }
    ],
    "metadata": {
      "processingTime": 487,
      "model": "gemini-1.5-flash"
    }
  },
  "timestamp": "2026-03-21T10:30:00.000Z"
}
```

### What Happens Internally

```
1. Frontend sends greeting
2. Server receives POST /api/sunny/message
3. Validation: ✓ message exists and not empty
4. detect message type → "greeting"
5. buildPrompt with greeting template
6. Call Gemini with system prompt
7. Response: "¡Hola! Soy Sunny..."
8. Generate suggested actions
9. Return with new sessionId
10. Frontend displays response with actions
```

---

## Example 2: SEO Question (Continuing Conversation)

**What happens:**
- User continues conversation (uses same sessionId)
- Sunny detects it's an SEO question
- Provides detailed technical answer with case reference

### Using cURL

```bash
curl -X POST http://localhost:4000/api/sunny/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cómo puedo mejorar mi ranking en Google? Mi sitio tiene poca visibilidad.",
    "sessionId": "session_1711025400000_a7f2k9",
    "metadata": {
      "device": "desktop",
      "isFirstTime": false
    }
  }' | jq
```

### Using JavaScript

```javascript
const sessionId = "session_1711025400000_a7f2k9";  // From Example 1

const response = await fetch('http://localhost:4000/api/sunny/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: '¿Cómo puedo mejorar mi ranking en Google? Mi sitio tiene poca visibilidad.',
    sessionId: sessionId,  // Continue same conversation
    metadata: {
      device: 'desktop',
      isFirstTime: false
    }
  })
});

const data = await response.json();
console.log(data.data.response);
console.log('Suggested actions:', data.data.suggestedActions);
```

### Expected Response

```json
{
  "ok": true,
  "data": {
    "response": "Excelente pregunta. El ranking en Google depende de varios factores clave:\n\n1. **Estructura Técnica**: Tu sitio debe estar bien estructurado (SEO on-page), con títulos y meta descripciones optimizadas. Esto es lo que ayudó a Nature Sunshine a mejorar significativamente.\n\n2. **Contenido de Calidad**: Google valora contenido original, relevante y útil para los usuarios.\n\n3. **Backlinks**: Los enlaces desde otros sitios web confiables mejoran tu autoridad. ¿Quieres conocer más detalles?",
    "sessionId": "session_1711025400000_a7f2k9",
    "confidence": 0.92,
    "suggestedActions": [
      {
        "label": "Agendar Consulta",
        "action": "schedule_consultation",
        "priority": "high"
      },
      {
        "label": "Más Información",
        "action": "view_resources",
        "priority": "medium"
      }
    ],
    "metadata": {
      "processingTime": 523,
      "model": "gemini-1.5-flash"
    }
  },
  "timestamp": "2026-03-21T10:31:15.000Z"
}
```

### What Happens Internally

```
1. Frontend sends SEO question with existing sessionId
2. Server validates input
3. Detect message type → "seo_question"
4. buildPrompt with SEO template
5. getSeoPromptemplate → "El usuario pregunta sobre SEO. Explica..."
6. Call Gemini with:
   - System prompt (Sunny's personality)
   - SEO template
   - User message
7. Gemini references Nature Sunshine case (from prompt)
8. Generate suggested actions (detects keywords)
9. Return with SAME sessionId (maintains conversation)
10. Frontend shows response + action buttons
```

---

## Example 3: Pricing Inquiry

**What happens:**
- User asks about pricing and packages
- Sunny provides flexible response
- Suggests scheduling consultation

### Using cURL

```bash
curl -X POST http://localhost:4000/api/sunny/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuál es el costo de una consulta? Tengo un pequeño negocio.",
    "sessionId": "session_1711025400000_a7f2k9",
    "metadata": {
      "device": "mobile",
      "businessSize": "small",
      "budget": "limited"
    }
  }' | jq '.data | {response, suggestedActions}'
```

### Using JavaScript

```javascript
const response = await fetch('http://localhost:4000/api/sunny/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: '¿Cuál es el costo de una consulta? Tengo un pequeño negocio.',
    sessionId: "session_1711025400000_a7f2k9",
    metadata: {
      device: 'mobile',
      businessSize: 'small',
      budget: 'limited'
    }
  })
});

const { data } = await response.json();
console.log('Response:', data.response);
console.log('Confidence:', data.confidence);
console.log('Actions:', data.suggestedActions);
```

### Expected Response

```json
{
  "ok": true,
  "data": {
    "response": "Entiendo perfectamente. En WebsPTY ofrecemos diferentes planes adaptados al tamaño y necesidades de tu negocio:\n\n**Para pequeños negocios** tenemos opciones muy accesibles que incluyen análisis SEO inicial, recomendaciones y asesoría estratégica.\n\nLa primera consulta es una excelente forma de conocer exactamente qué necesita tu negocio. ¿Te gustaría agendar una consulta inicial?",
    "sessionId": "session_1711025400000_a7f2k9",
    "confidence": 0.93,
    "suggestedActions": [
      {
        "label": "Agendar Consulta",
        "action": "schedule_consultation",
        "priority": "high"
      },
      {
        "label": "Ver Precios",
        "action": "view_pricing",
        "priority": "high"
      }
    ],
    "metadata": {
      "processingTime": 401,
      "model": "gemini-1.5-flash"
    }
  },
  "timestamp": "2026-03-21T10:32:45.000Z"
}
```

### What Happens Internally

```
1. Frontend sends pricing question
2. Server validates input
3. Detect message type → "pricing"
4. buildPrompt with pricing template
5. getPricingTemplate → "El usuario pregunta sobre precios..."
6. Call Gemini with pricing context
7. Gemini generates flexible pricing response
8. Generate suggested actions (detected "pricing" keywords)
9. Return response + high-priority actions
10. Frontend displays both "Agendar" and "Ver Precios" buttons
```

---

## Error Examples

### Error 1: Empty Message

```bash
curl -X POST http://localhost:4000/api/sunny/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "",
    "sessionId": "session_123"
  }' | jq
```

**Response (400 Bad Request):**
```json
{
  "ok": false,
  "error": "MESSAGE_REQUIRED",
  "message": "El mensaje no puede estar vacío.",
  "statusCode": 400
}
```

### Error 2: Message Too Long

```bash
curl -X POST http://localhost:4000/api/sunny/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Lorem ipsum dolor sit amet... (6000+ characters)",
    "sessionId": "session_123"
  }' | jq
```

**Response (400 Bad Request):**
```json
{
  "ok": false,
  "error": "MESSAGE_TOO_LONG",
  "message": "El mensaje no puede exceder 5000 caracteres."
}
```

### Error 3: API Service Unavailable

If Gemini API is down:

```json
{
  "ok": false,
  "error": "IA_SERVICE_UNAVAILABLE",
  "message": "El servicio de IA no está disponible en este momento. Intenta más tarde.",
  "statusCode": 503
}
```

---

## Health Check

**Purpose:** Verify Sunny backend is running and Gemini is accessible

### Using cURL

```bash
curl -X GET http://localhost:4000/api/sunny/health | jq
```

### Using JavaScript

```javascript
const response = await fetch('http://localhost:4000/api/sunny/health');
const data = await response.json();
console.log(data);
```

### Expected Response

```json
{
  "ok": true,
  "message": "Sunny IA assistant is healthy",
  "timestamp": "2026-03-21T10:30:00.000Z"
}
```

---

## Testing Checklist

- [ ] **Server starts:** `node server-sunny.js` runs without errors
- [ ] **Health check passes:** `GET /api/sunny/health` returns 200
- [ ] **Greeting works:** POST greeting gets response with new sessionId
- [ ] **Conversation continues:** Using same sessionId works
- [ ] **Message detection:** SEO question triggers appropriate template
- [ ] **Suggested actions:** Response includes relevant action buttons
- [ ] **Error handling:** Empty message returns 400 error
- [ ] **Confidence scores:** All responses include confidence 0.85+
- [ ] **Processing time:** All responses include processingTime in ms
- [ ] **Frontend integration:** Responses display correctly in chatbot widget

---

## Frontend Integration Code

```javascript
// In nature-sunshine-demo3.html

async function sendMessageToSunny(userMessage, sessionId) {
  try {
    // Show loading state
    showLoadingIndicator();

    // Send request
    const response = await fetch('http://localhost:4000/api/sunny/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        sessionId: sessionId || null,  // null = new session
        metadata: {
          device: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      })
    });

    const data = await response.json();

    // Handle error
    if (!data.ok) {
      showError(data.message || 'Error desconocido');
      return null;
    }

    // Update session ID if it's new
    if (!sessionId) {
      window.sunnySessionId = data.data.sessionId;
    }

    // Display response
    addChatMessage(data.data.response, false);  // false = from Sunny
    
    // Display suggested actions
    if (data.data.suggestedActions?.length) {
      showActionButtons(data.data.suggestedActions);
    }

    // Log for debugging
    console.log('Response time:', data.data.metadata.processingTime, 'ms');
    console.log('Confidence:', data.data.confidence);

    return data.data;

  } catch (error) {
    console.error('Sunny API error:', error);
    showError('No se pudo conectar con Sunny. Intenta nuevamente.');
  }
}
```

---

## Troubleshooting

**Issue:** "Connection refused" when calling API
- Solution: Make sure `node server-sunny.js` is running
- Check: `curl http://localhost:4000/api/sunny/health`

**Issue:** "GEMINI_API_KEY not found"
- Solution: Add to `.env`: `GEMINI_API_KEY=YOUR_GEMINI_API_KEY`
- Restart server

**Issue:** Slow responses (>5 seconds)
- Possible: Gemini API is slow or network issue
- Check: `SUNNY_TIMEOUT_MS` in config (default 10000ms)

**Issue:** "The response from Gemini was empty"
- Solution: Check API key is valid in Google AI Studio
- May need to regenerate key

---

## Performance Notes

- **First response:** 300-600ms (includes Gemini API call)
- **Typical response:** 200-500ms
- **Max timeout:** 10 seconds (configured in sunnyConfig)
- **Rate limit:** 300 requests per 15 minutes
