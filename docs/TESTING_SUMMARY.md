# Sunny IA Assistant - Step 11 Testing Summary

## 📋 Testing Artifacts Created

### 1. **EXAMPLE_REQUESTS.js** (JavaScript Objects)
- Structured examples with expected responses
- Can be imported and used in tests
- Includes: greeting, SEO question, pricing, error cases

### 2. **TESTING_GUIDE.md** (Comprehensive Guide)
- Detailed explanations for each test
- cURL examples
- JavaScript fetch examples
- Expected responses
- Error scenarios
- Troubleshooting

### 3. **test_sunny_api.sh** (Automated Test Script)
- Bash script that runs all tests
- Auto-detects if server is running
- Extracts sessionId for conversation continuity  
- Tests: health check + 3 messages + error handling

---

## 🚀 How to Run Tests

### Option 1: Automated Testing (Recommended)

**Terminal 1 - Start the Sunny server:**
```bash
cd /Users/mctaggartspirit/Desktop/webspty
node server-sunny.js
```

Expected output:
```
[SUNNY] 2026-03-21T10:30:00.000Z Express server listening on port 4000
[SUNNY AI] Google Gemini initialized
```

**Terminal 2 - Run all tests:**
```bash
cd /Users/mctaggartspirit/Desktop/webspty
bash test_sunny_api.sh
```

This will automatically run:
- ✓ Health check
- ✓ Greeting (new session)
- ✓ SEO question (continue session)  
- ✓ Pricing inquiry (continue session)
- ✓ Error validation (empty message)

---

### Option 2: Manual Testing with cURL

**Start server (Terminal 1):**
```bash
node server-sunny.js
```

**Test in Terminal 2:**

#### Health Check
```bash
curl http://localhost:4000/api/sunny/health | jq
```

#### Test 1: Greeting
```bash
curl -X POST http://localhost:4000/api/sunny/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¡Hola Sunny!",
    "sessionId": null,
    "metadata": {
      "device": "mobile"
    }
  }' | jq '.data | {response, sessionId, suggestedActions}'
```

#### Test 2: SEO Question
```bash
# Replace SESSION_ID with the one from Test 1
curl -X POST http://localhost:4000/api/sunny/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cómo puedo mejorar mi ranking en Google?",
    "sessionId": "SESSION_ID_FROM_TEST_1",
    "metadata": {
      "device": "desktop"
    }
  }' | jq '.data | {response, confidence, suggestedActions}'
```

#### Test 3: Pricing Question
```bash
curl -X POST http://localhost:4000/api/sunny/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuál es el precio para pequeños negocios?",
    "sessionId": "SESSION_ID_FROM_TEST_1",
    "metadata": {
      "device": "mobile"
    }
  }' | jq '.data'
```

---

### Option 3: JavaScript Testing (In Browser)

Open browser console and paste:

```javascript
// Test function
async function testSunny() {
  // Test 1: Greeting
  console.log('📝 Test 1: Greeting...');
  let response = await fetch('http://localhost:4000/api/sunny/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: '¡Hola Sunny!',
      metadata: { device: 'web' }
    })
  });
  
  let data = await response.json();
  const sessionId = data.data.sessionId;
  console.log('✅ Got response:', data.data.response.substring(0, 100) + '...');
  console.log('📌 Session ID:', sessionId);
  console.log('');
  
  // Test 2: SEO Question
  console.log('📝 Test 2: SEO Question...');
  response = await fetch('http://localhost:4000/api/sunny/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: '¿Cómo mejorar mi SEO?',
      sessionId: sessionId,
      metadata: { device: 'web' }
    })
  });
  
  data = await response.json();
  console.log('✅ Got response:', data.data.response.substring(0, 100) + '...');
  console.log('💡 Suggested actions:', data.data.suggestedActions);
  console.log('⏱️  Processing time:', data.data.metadata.processingTime, 'ms');
}

// Run it
testSunny();
```

---

## 📊 Example Test Results

### Test 1: Greeting
```
REQUEST: ¡Hola Sunny!
RESPONSE: ¡Hola! Soy Sunny, tu asistente de IA especializado en SEO...
CONFIDENCE: 0.95
SESSION_ID: session_1711025400000_a7f2k9
PROCESSING_TIME: 487ms
SUGGESTED_ACTIONS: [{"label": "Ver Precios", "action": "view_pricing"}]
```

### Test 2: SEO Question  
```
REQUEST: ¿Cómo puedo mejorar mi ranking en Google?
RESPONSE: Excelente pregunta. El ranking en Google depende de varios factores clave:
  1. Estructura Técnica (Sunny mentions Nature Sunshine case)
  2. Contenido de Calidad
  3. Backlinks
CONFIDENCE: 0.92
SUGGESTED_ACTIONS: [
  {"label": "Agendar Consulta", "priority": "high"},
  {"label": "Más Información", "priority": "medium"}
]
PROCESSING_TIME: 523ms
```

### Test 3: Pricing Question
```
REQUEST: ¿Cuál es el costo de una consulta?
RESPONSE: Entiendo perfectamente. En WebsPTY ofrecemos diferentes planes...
CONFIDENCE: 0.93
SUGGESTED_ACTIONS: [
  {"label": "Agendar Consulta", "priority": "high"},
  {"label": "Ver Precios", "priority": "high"}
]
PROCESSING_TIME: 401ms
```

---

## ✅ Verification Checklist

Run through these to confirm everything works:

- [ ] **Server starts** - `node server-sunny.js` runs without errors
- [ ] **API is accessible** - `curl http://localhost:4000/api/sunny/health` returns 200
- [ ] **Greeting works** - Sends message, gets response, gets sessionId
- [ ] **Conversation continues** - Using same sessionId maintains context
- [ ] **Message type detection** - SEO question triggers appropriate response
- [ ] **Suggested actions** - Response includes relevant action buttons
- [ ] **Error handling** - Empty message returns 400 bad request
- [ ] **Confidence scores** - All responses have 0.8+ confidence
- [ ] **Processing time** - Responses include timing in milliseconds
- [ ] **Response structure** - All responses have `ok`, `data`, `timestamp`

---

## 🔍 What Each Test Validates

### Test 1: Greeting
✓ Server routing (POST /api/sunny/message)
✓ Input validation (non-empty message)
✓ Session ID generation
✓ Message type detection ("greeting")
✓ Prompt building (greeting template)
✓ Gemini API call
✓ Response formatting
✓ Suggested actions generation

### Test 2: SEO Question
✓ Session continuity (same sessionId)
✓ Message type detection ("seo_question")
✓ Context-aware prompts
✓ Keyword detection
✓ Case study reference (Nature Sunshine)
✓ Action button relevance (high-priority)
✓ Multi-turn conversation

### Test 3: Pricing Question
✓ Device detection (mobile)
✓ Flexible pricing response 
✓ Budget-aware suggestions
✓ Multiple call-to-action options
✓ Mobile-friendly response length

### Test 4: Error Handling
✓ Input validation (empty message)
✓ Proper error codes (400)
✓ Clear error messages
✓ Response structure maintained

---

## 🐛 Troubleshooting

### "Cannot GET /api/sunny/health"
- Server not running
- Fix: `node server-sunny.js` in Terminal 1

### "Empty response from Gemini"
- API key invalid or expired
- Fix: Update `.env` with valid GEMINI_API_KEY

### "Connection refused on localhost:4000"
- Server crashed or didn't start
- Check: Look for error messages in terminal
- Fix: Restart with `node server-sunny.js`

### "Request timeout after 10 seconds"
- Gemini API is slow or unreachable
- Fix: Check internet connection, try again

### "Rate limit exceeded"
- Too many requests (>300 per 15 min)
- Fix: Wait 15 minutes or use different session

---

## 📁 Testing Files Reference

```
/Users/mctaggartspirit/Desktop/webspty/
├── EXAMPLE_REQUESTS.js      ← JavaScript objects with examples
├── TESTING_GUIDE.md         ← Detailed testing documentation
├── test_sunny_api.sh        ← Automated test script
├── CONFIG_GUIDE.md          ← Configuration explanation
├── PROMPTS_GUIDE.md         ← Prompts system guide
├── server-sunny.js          ← Main server (run this)
├── routes/sunnyRoutes.js    ← API endpoints
├── controllers/sunnyController.js
├── services/sunnyAI.js
├── ai/llmProvider.js
├── prompts/sunnyPrompts.js
└── config/sunnyConfig.js
```

---

## 🎯 Next Steps After Testing

1. **If all tests pass:** 
   - Integrate with frontend (`nature-sunshine-demo3.html`)
   - Update chatbot to call real backend
   - Deploy server to production

2. **If tests fail:**
   - Check error messages
   - Review TESTING_GUIDE.md troubleshooting
   - Verify API key is valid
   - Check network connectivity

3. **Performance optimization:**
   - Monitor response times (target: <500ms)
   - Add caching for similar questions
   - Implement session persistence
   - Add rate limiting per user

4. **Production readiness:**
   - [ ] Add authentication
   - [ ] Add logging/monitoring
   - [ ] Set up error tracking (Sentry)
   - [ ] Deploy to cloud (GCP, AWS, etc.)
   - [ ] Add database for conversation history
   - [ ] Set up CI/CD pipeline

---

## 📞 Support

For each component, refer to:
- **Configuration issues** → CONFIG_GUIDE.md
- **Prompt customization** → PROMPTS_GUIDE.md 
- **Testing problems** → TESTING_GUIDE.md
- **Architecture overview** → Previous Paso 10 explanation
- **Codebase structure** → File tree above
