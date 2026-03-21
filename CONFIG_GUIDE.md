# Sunny IA Assistant - Configuration & API Key Management

## Overview

Sunny is a separate IA assistant service from FlorIA, but **shares the same API key** to avoid duplication and simplify management.

## How to Configure

### 1. Get Your API Key

Obtain a Google Gemini API key from:
- [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Add to `.env` File

Edit `.env` in the project root:

```bash
GEMINI_API_KEY=AIzaSyAlo2cfIHf56H1IVqUnvlrswvapHDlaApA
```

**Important:** This is the **same variable** used by both Sunny and FlorIA.

### 3. How It Works (No Duplication)

```
.env file (single source of truth)
    ↓
    GEMINI_API_KEY=...
    ↓
    ├─→ config/sunnyConfig.js (Sunny reads it)
    │   └─→ services/sunnyAI.js
    │       └─→ Google Gemini API
    │
    └─→ FlorIA config (FlorIA reads it)
        └─→ FlorIA services
            └─→ Google Gemini API
```

**Result:** Both services use the same `GEMINI_API_KEY` from `.env` without duplication.

## File Structure

```
config/
  ├── sunny.config.js      (Legacy - still valid)
  └── sunnyConfig.js       (New - recommended)

services/
  └── sunnyAI.js           (IA logic layer)

ai/
  └── llmProvider.js       (Adapter pattern)

controllers/
  └── sunnyController.js   (Request handling)
```

## Configuration Files Explained

### config/sunnyConfig.js

Main configuration file for Sunny service:

```javascript
const config = require('./config/sunnyConfig');

// Access settings
config.GEMINI_API_KEY    // Shared API key
config.gemini.model      // Model name (gemini-1.5-flash)
config.ai.maxTokens      // Max output (1024)
config.ai.temperature    // Creativity (0.7)
config.port              // Server port (4000)
config.systemPrompt      // Sunny's personality prompt

// Helper functions
config.isConfigured()              // Is API key present?
config.getConfigSummary()          // Full config details
config.logConfiguration()          // Log config on startup
```

### Usage in Code

```javascript
// In services/sunnyAI.js
const sunnyConfig = require('../config/sunnyConfig');

const geminiClient = new GoogleGenerativeAI(
  sunnyConfig.GEMINI_API_KEY  // Reads from .env
);

const response = await model.generateContent({
  generationConfig: {
    maxOutputTokens: sunnyConfig.ai.maxTokens,
    temperature: sunnyConfig.ai.temperature
  }
});
```

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `GEMINI_API_KEY` | (required) | Shared API key for Sunny & FlorIA |
| `GOOGLE_GEMINI_MODEL` | `gemini-1.5-flash` | Model to use |
| `SUNNY_PORT` | `4000` | Sunny service port |
| `SUNNY_MAX_TOKENS` | `1024` | Max response length |
| `SUNNY_TEMPERATURE` | `0.7` | Response creativity (0-1) |
| `SUNNY_TIMEOUT_MS` | `10000` | Request timeout (ms) |
| `SUNNY_RETRY_ATTEMPTS` | `2` | Failed request retries |
| `LOG_LEVEL` | `info` | Log verbosity |
| `NODE_ENV` | `development` | Environment (dev/prod) |

## Updating the API Key

If you need to change the API key:

1. Update only `.env`:
   ```bash
   GEMINI_API_KEY=new_key_here
   ```

2. Restart Sunny and FlorIA services

3. Both services automatically read the new key on next startup

**No code changes needed!**

## Separation Between Sunny and FlorIA

- **Sunny** uses: `config/sunnyConfig.js` → `services/sunnyAI.js` → `ai/llmProvider.js`
- **FlorIA** uses: Its own config module (separate from Sunny)
- **Shared**: Only `GEMINI_API_KEY` in `.env`

This ensures that:
- Services can evolve independently
- API key duplication is avoided
- Configuration is centralized and easy to manage
- Credentials are never exposed in code

## Troubleshooting

### "GEMINI_API_KEY not found"

Check that:
1. `.env` file exists in project root
2. Contains: `GEMINI_API_KEY=your_key`
3. No typos in variable name
4. Restart your Node process

### "API key invalid or expired"

1. Regenerate key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Update `.env`
3. Restart services

### "Timeout errors"

Increase `SUNNY_TIMEOUT_MS`:
```bash
SUNNY_TIMEOUT_MS=20000  # 20 seconds instead of 10
```

## Security Notes

- **Never** commit `.env` to git
- **Never** hardcode API keys in source files
- Use `.gitignore` to exclude `.env`:
  ```
  .env
  .env.local
  ```
- Rotate API keys periodically
- Keep `.env.example` as template (without real keys)
