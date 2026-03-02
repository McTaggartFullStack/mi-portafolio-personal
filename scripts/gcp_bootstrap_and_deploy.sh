#!/usr/bin/env bash
set -euo pipefail

# Usage:
# PROJECT_ID="tu-project-id" \
# REGION="us-east1" \
# SERVICE_NAME="mi-portafolio-personal" \
# GEMINI_API_KEY="..." \
# RECAPTCHA_SITE_KEY="..." \
# RECAPTCHA_SECRET_KEY="..." \
# ./scripts/gcp_bootstrap_and_deploy.sh

: "${PROJECT_ID:?Falta PROJECT_ID}"
: "${REGION:=us-east1}"
: "${SERVICE_NAME:=mi-portafolio-personal}"
: "${GEMINI_API_KEY:?Falta GEMINI_API_KEY}"
: "${RECAPTCHA_SITE_KEY:?Falta RECAPTCHA_SITE_KEY}"
: "${RECAPTCHA_SECRET_KEY:?Falta RECAPTCHA_SECRET_KEY}"

echo "[1/7] Configurando proyecto..."
gcloud config set project "$PROJECT_ID"

echo "[2/7] Habilitando APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com

echo "[3/7] Creando/actualizando secretos..."
for SECRET_NAME in GEMINI_API_KEY RECAPTCHA_SITE_KEY RECAPTCHA_SECRET_KEY; do
  if ! gcloud secrets describe "$SECRET_NAME" >/dev/null 2>&1; then
    gcloud secrets create "$SECRET_NAME" --replication-policy="automatic"
  fi
done

printf "%s" "$GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-
printf "%s" "$RECAPTCHA_SITE_KEY" | gcloud secrets versions add RECAPTCHA_SITE_KEY --data-file=-
printf "%s" "$RECAPTCHA_SECRET_KEY" | gcloud secrets versions add RECAPTCHA_SECRET_KEY --data-file=-

echo "[4/7] Build de imagen con Cloud Build..."
gcloud builds submit --config cloudbuild.yaml --substitutions=_SERVICE_NAME="$SERVICE_NAME",_REGION="$REGION"

echo "[5/7] Vinculando secretos al servicio Cloud Run..."
gcloud run services update "$SERVICE_NAME" \
  --region "$REGION" \
  --update-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest,RECAPTCHA_SITE_KEY=RECAPTCHA_SITE_KEY:latest,RECAPTCHA_SECRET_KEY=RECAPTCHA_SECRET_KEY:latest \
  --set-env-vars NODE_ENV=production

echo "[6/7] Obteniendo URL del servicio..."
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format='value(status.url)')
echo "URL: $SERVICE_URL"

echo "[7/7] Health check..."
curl -fsS "$SERVICE_URL/api/health" && echo "\nOK"

echo "Deploy completado."
