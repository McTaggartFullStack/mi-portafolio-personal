# Deploy checklist (Cloud Run)

## 1) Pre-requisitos
- Tener `gcloud` instalado y autenticado (`gcloud auth login`).
- Tener permisos de Project Owner/Editor + Secret Manager Admin + Cloud Run Admin + Cloud Build Editor.

## 2) Ejecutar bootstrap + deploy
Ejecuta el script con tus valores reales:

PROJECT_ID="TU_PROJECT_ID" \
REGION="us-east1" \
SERVICE_NAME="mi-portafolio-personal" \
GEMINI_API_KEY="TU_GEMINI_API_KEY" \
RECAPTCHA_SITE_KEY="TU_RECAPTCHA_SITE_KEY" \
RECAPTCHA_SECRET_KEY="TU_RECAPTCHA_SECRET_KEY" \
./scripts/gcp_bootstrap_and_deploy.sh

## 3) Verificaciones rápidas
- `/api/health` responde `{ ok: true }`.
- `/api/recaptcha-sitekey` responde `sitekey`.
- Chat responde en `/api/chat` con `x-session-id`.

## 4) Si algo falla
- Revisar logs del servicio:
  gcloud run services logs read mi-portafolio-personal --region us-east1 --limit 100
- Confirmar secretos:
  gcloud secrets versions list GEMINI_API_KEY
  gcloud secrets versions list RECAPTCHA_SITE_KEY
  gcloud secrets versions list RECAPTCHA_SECRET_KEY

## 5) Limpieza recomendada
- Mantener `backend/` solo como carpeta legacy o eliminarla en un PR aparte.
- No subir `.env` real al repositorio.
