# Sunny IA Assistant - Prompts Guide

## Overview

`prompts/sunnyPrompts.js` contains all system prompts, user templates, and prompt-building logic for Sunny. This ensures **consistency, maintainability, and complete separation from FlorIA**.

## Key Components

### 1. System Prompt (`SYSTEM_PROMPT`)

Defines Sunny's personality, role, and constraints:

```javascript
const SYSTEM_PROMPT = `Eres Sunny, un asistente de IA amigable y profesional...`
```

**What it covers:**
- Who Sunny is (friendly, professional IA assistant)
- What Sunny specializes in (SEO, web development, marketing)
- Tone and communication style
- Case study reference (Nature Sunshine)
- Boundaries and guardrails

### 2. User Prompt Templates (`USER_PROMPT_TEMPLATES`)

Different templates for different conversation types:

```javascript
const USER_PROMPT_TEMPLATES = {
  greeting: "...",          // First contact
  seo_question: "...",      // SEO-related questions
  pricing: "...",           // Cost/plan inquiries
  case_study: "...",        // "Tell us about Nature Sunshine"
  consultation: "...",      // Meeting requests
  technical: "...",         // Web development questions
  out_of_scope: "..."       // Unrelated topics
}
```

### 3. Context Templates (`CONTEXT_TEMPLATES`)

Adapt responses based on user metadata:

```javascript
const CONTEXT_TEMPLATES = {
  first_time_visitor: "...",  // Warmer, more explanatory
  returning_visitor: "...",   // Get to the point faster
  mobile_user: "...",         // Keep responses brief
  desktop_user: "..."         // More detail allowed
}
```

### 4. Safety Guardrails (`SAFETY_GUARDRAILS`)

Prevents misuse and out-of-scope responses:
- Don't promise guaranteed results
- Don't simulate real people
- Don't share confidential info
- Don't step outside expertise

## Usage

### Basic: Get System Prompt

```javascript
const prompts = require('./prompts/sunnyPrompts');

const systemPrompt = prompts.getSystemPrompt();
// Returns: "Eres Sunny, un asistente de IA..."
```

### With Tone Customization

```javascript
// Professional tone
const proPrompt = prompts.getSystemPrompt('professional');

// Technical tone
const techPrompt = prompts.getSystemPrompt('technical');
```

### Detect Message Type

Automatically identify what the user is asking about:

```javascript
const messageType = prompts.detectMessageType("¿Cuál es tu precio?");
// Returns: "pricing"

const messageType = prompts.detectMessageType("¿Cómo mejorar mi SEO?");
// Returns: "seo_question"
```

### Build Complete Prompt

Combine system, context, and user templates:

```javascript
const prompt = prompts.buildPrompt(
  "Hola, ¿en qué puedo mejorar?",
  {
    tone: 'friendly',
    messageType: 'greeting',
    metadata: {
      isFirstTime: true,
      device: 'mobile'
    }
  }
);

console.log(prompt);
// Returns:
// {
//   system: "Eres Sunny...",
//   context: "Este es el primer mensaje...",
//   userTemplate: "El usuario ha saludado...",
//   userMessage: "Hola, ¿en qué puedo mejorar?",
//   combined: "SYSTEM:\n... CONTEXT:\n... TEMPLATE:\n... USER MESSAGE:\n..."
// }
```

### Get User Template

```javascript
const template = prompts.getUserPromptTemplate('seo_question');
// Returns: "El usuario pregunta sobre SEO. Explica de forma clara..."
```

### Get Context

```javascript
const context = prompts.getContextTemplate({
  isFirstTime: true,
  device: 'mobile'
});
// Returns: Mobile-first response pattern
```

## Integration with Services

### Flow: Controller → LLM Provider → AI Service → Prompts

```
Frontend POST /api/sunny/message
    ↓
sunnyController.handleChatMessage()
    ├→ Validate input
    ├→ Extract: message, sessionId, metadata
    ↓
ai/llmProvider.generateResponse()
    ├→ Call services/sunnyAI.generateAIResponse()
    ↓
services/sunnyAI.callGemini()
    ├→ Import: prompts/sunnyPrompts.js
    ├→ detectMessageType(userMessage)
    ├→ buildPrompt(userMessage, options)
    ├→ getSystemPrompt('friendly')
    ├→ Combine all prompts
    ↓
Google Gemini API
    ↓
Response → frontend
```

## How Prompts Are Used

In `services/sunnyAI.js`:

```javascript
// 1. Detect what the user is asking
const messageType = sunnyPrompts.detectMessageType(userMessage);

// 2. Build complete prompt with context
const promptObj = sunnyPrompts.buildPrompt(userMessage, {
  tone: 'friendly',
  messageType: messageType,
  metadata: metadata
});

// 3. Get system prompt (with guardrails)
const systemPrompt = sunnyPrompts.getSystemPrompt('friendly');

// 4. Send to Gemini
const response = await model.generateContent({
  contents: [{
    role: 'user',
    parts: [{ text: `${systemPrompt}\n\nUsuario: ${userMessage}` }]
  }]
});
```

## Customizing Prompts

### Add New Message Type

1. Add to `USER_PROMPT_TEMPLATES`:
```javascript
USER_PROMPT_TEMPLATES.my_type = `The user is asking about...`
```

2. Update `detectMessageType()` to recognize keywords:
```javascript
if (lower.includes('keyword')) {
  return 'my_type';
}
```

### Add New Context

1. Add to `CONTEXT_TEMPLATES`:
```javascript
CONTEXT_TEMPLATES.my_context = `Special context...`
```

2. Use in `getContextTemplate()`:
```javascript
if (someCondition) {
  return CONTEXT_TEMPLATES.my_context;
}
```

### Modify System Prompt

Edit `SYSTEM_PROMPT` directly. The text acts as:
- Sunny's "personality" and constraints
- Instructions for how to behave
- Examples of good responses
- Guardrails against misuse

## Important Notes

### ✅ Separated from FlorIA

- `prompts/sunnyPrompts.js` is **completely independent**
- No shared prompt logic with FlorIA
- FlorIA has its own prompt configuration
- Both services can evolve separately

### ✅ All Prompts Centralized

- No hardcoded prompts scattered in code
- Single source of truth in `prompts/sunnyPrompts.js`
- Easy to update all prompts at once
- Version-controlled and trackable

### ✅ Flexible and Extensible

- Support multiple tones (friendly, professional, technical)
- Auto-detect message type
- Context-aware responses
- Easy to add new templates

## Testing Prompts

```bash
# Test module loads
node -e "const p = require('./prompts/sunnyPrompts'); console.log('OK')"

# Test prompt generation
node -e "const p = require('./prompts/sunnyPrompts'); console.log(p.buildPrompt('Hola'))"

# Test message detection
node -e "const p = require('./prompts/sunnyPrompts'); console.log(p.detectMessageType('¿Precio?'))"
```

## Troubleshooting

**Issue:** Responses are too generic
- Solution: Check `detectMessageType()` - add more keywords for your domain

**Issue:** Tone doesn't match brand
- Solution: Edit `SYSTEM_PROMPT` to match your tone preferences

**Issue:** Prompts conflict with another service
- Solution: Ensure only `sunnyPrompts.js` is imported in Sunny services, not FlorIA prompts
