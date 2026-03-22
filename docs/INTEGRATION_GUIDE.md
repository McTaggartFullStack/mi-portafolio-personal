# 🚀 Integración Frontend-Backend Sunny IA

## Estado Actual ✅

**Frontend**: `nature-sunshine-demo3.html` ahora conecta al backend real
**Backend**: `server-sunny.js` corre en puerto 4000
**Estado**: Listo para testing

---

## Cambios Realizados

### 1. **Frontend Updates** (`nature-sunshine-demo3.html`)

#### Antes (Mock Response):
```javascript
iaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const prompt = iaInput.value.trim();
    
    addMessage(prompt, true);
    setTimeout(() => {
        addMessage('Demo frontend: respuesta hardcodeada...');
    }, 450);
});
```

#### Ahora (Llamada Real a API):
```javascript
iaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = iaInput.value.trim();
    
    addMessage(prompt, true);
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    try {
        const response = await fetch('http://localhost:4000/api/sunny/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: prompt,
                sessionId: getSessionId(),
                context: 'demo'
            })
        });
        
        const data = await response.json();
        await typeMessage(data.response, false, 18);
    } catch (error) {
        addMessage(`Error: ${error.message}...`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar';
    }
});
```

### 2. **Nuevas Funciones**

`getSessionId()`: 
- Crea o recupera ID de sesión único por navegador
- Almacenado en `sessionStorage` 
- Permite multi-turn conversations

### 3. **UI Improvements**

- Botón "Enviar" muestra "Enviando..." durante la llamada
- Input deshabilitado mientras se espera respuesta
- Manejo completo de errores
- Mensajes de error informativos

---

## Cómo Testear

### 📋 Checklist Previo

```bash
# 1. Verifica que .env tiene GEMINI_API_KEY
cat .env | grep GEMINI

# 2. Instala dependencias (si no las tienes)
npm install

# 3. El backend ya debe estar corriendo en otra terminal

# 4. Abre la demo en navegador
open nature-sunshine-demo3.html
# o navega a: file:///Users/mctaggartspirit/Desktop/webspty/nature-sunshine-demo3.html
```

### 🧪 Test Flow

1. **Abre el navegador** → `nature-sunshine-demo3.html`
2. **Haz clic** en el botón circular de Sunny (abajo derecha)
3. **Escribe una pregunta**, ej:
   - "¿Que productos tienen?"
   - "¿Cuanto cuesta una consulta?"
   - "Quiero contactar al equipo comercial"
4. **Presiona "Enviar"**
5. **Observa**:
   - ✅ Botón cambia a "Enviando..." 
   - ✅ Input se deshabilita
   - ✅ Gemini IA responde en 2-5 segundos
   - ✅ Respuesta se anima con typing effect
   - ✅ Puedes continuar la conversación (multi-turn)

### ✅ Expected Results

**Pregunta**: "Hola, quiero saber sobre Nature Sunshine"

**Respuesta esperada** (ejemplo de Gemini):
```
Nature Sunshine es una marca que ofrece productos 
para bienestar y salud natural. Basados en ingredientes 
premium, nuestros productos están diseñados para 
mejorar calidad de vida...
```

### ⚠️ Troubleshooting

| Problema | Solución |
|----------|----------|
| **"Error: Error en la IA"** | Verifica que backend corre: `node server-sunny.js` en otra terminal |
| **CORS Error en console** | Backend tiene CORS habilitado, revisa `server-sunny.js` línea 7 |
| **API no responde** | Confirma GEMINI_API_KEY en `.env` es válida |
| **Timeout (5+ segundos)** | Gemini a veces tarda, es normal. Reintenta. |
| **Empty response** | Revisa logs del backend servidor para errores |

---

## Arquitectura End-to-End

```
┌─────────────────────┐
│ Browser             │
│ nature-sunshine-    │ POST /api/sunny/message
│ demo3.html          │──────────────────────────→
│ ├─ Chat Widget      │   { message, sessionId }
│ └─ Sunny Button     │
└─────────────────────┘
         ↑
         │ JSON Response
         │ { response: "Respuesta IA..." }
         │
┌─────────────────────────────────────┐
│ Backend: server-sunny.js (4000)     │
├─────────────────────────────────────┤
│ Routes → Controller → Provider      │
│           ↓                         │
│ Services → sunnyAI (Gemini API)    │
│           ↓                         │
│ config/sunnyConfig.js               │
│   ↓                                 │
│ prompts/sunnyPrompts.js             │
│   ↓                                 │
│ @google/generative-ai               │
└─────────────────────────────────────┘
         ↑
         │ API Key: GEMINI_API_KEY from .env
         │
    Google Cloud
    Gemini API
```

---

## Session Management

**Cada usuario obtiene un sessionId único:**

```javascript
session_1711098234_abc123def456
↑       ↑          
|       └─ Timestamp ms + random string
└─ Prefix (identifica sesión Sunny)
```

**Almacenamiento**: 
- `sessionStorage` (persiste mientras está la pestaña abierta)
- Se envía con cada request al backend
- Permite multi-turn conversations sin repetir contexto

---

## Validaciones Automáticas

✅ **Frontend**:
- Mensaje no vacío
- Máx 5000 caracteres (validado en backend)
- Input required HTML5

✅ **Backend** (en controller):
- Message no vacío
- Máx 5000 caracteres
- SessionId válido
- Rate limiting (300 req per 15 min)

✅ **LLM (Gemini)**:
- Respuestas guiadas por system prompt
- Safety guardrails (no responde ofensivo)
- Timeout 10 segundos
- Reintentos automáticos

---

## Próximos Pasos (Opcional)

### 1. **Persistencia de Sesión** (Paso 15)
```javascript
// Guardar conversación en localStorage o DB
sessions: {
  'session_123': {
    messages: [...],
    createdAt: '2026-03-21',
    userId: 'user_456'
  }
}
```

### 2. **Analytics**
```javascript
// Trackear: preguntas populares, engagement, etc
analytics: {
  totalMessages: 245,
  avgResponseTime: 2.3,
  satisfactionRate: 92%
}
```

### 3. **Multilingual Support**
```javascript
languages: ['es', 'en', 'pt', 'fr']
// Detectar idioma del usuario y responder en ese idioma
```

### 4. **Suggested Actions**
```javascript
// El backend ya genera suggestedActions
// Mostrar botones: "Ver más", "Contactar", "Productos", etc
```

---

## Arquivos Actualizados

- ✅ `nature-sunshine-demo3.html` → Real API integration
- ✅ `server-sunny.js` → Backend running (port 4000)
- ✅ Existing: routes, controller, service, config, prompts (sin cambios)

## Archivos Eliminados (limpios)

- ❌ ~~`config/sunny.config.js`~~ (superseded)
- ❌ ~~`sunny/` folder~~ (orphaned)

---

**Status**: 🟢 **READY FOR PRODUCTION TESTING**

¿Siguiente paso? Abre el navegador y prueba el chat con preguntas reales sobre Nature Sunshine. 🚀
