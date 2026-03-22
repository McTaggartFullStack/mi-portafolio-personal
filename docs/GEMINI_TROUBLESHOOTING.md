# Gemini troubleshooting (Cloud Run)

Si FlorIA responde "Gemini no disponible", revisa en orden:

1. **API key cargada en servicio**
   - Variable/secret `GEMINI_API_KEY` presente en Cloud Run.

2. **API habilitada en GCP**
   - Habilita: `generativelanguage.googleapis.com`.

3. **Restricciones de API key**
   - Si tu key está restringida, permite la API de Gemini/Generative Language.

4. **Cuota/facturación**
   - Revisa cuota y facturación del proyecto.

5. **Modelo**
   - El backend está fijado a `gemini-2.5-flash`.
   - No usar modelos 1.5.

## Variables recomendadas
- `GEMINI_API_KEY`
- `GEMINI_MODEL=gemini-2.5-flash` (opcional; el código ya lo fuerza)
- `RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`

## Test rápido
- `GET /api/health`
- `GET /api/recaptcha-sitekey`
- `POST /api/chat` con `x-session-id` y captcha válido.
