FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Dependencias (usa lockfile para builds reproducibles)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Solo backend necesario
COPY server.js ./

# Usuario no-root
USER node

EXPOSE 8080

CMD ["npm", "start"]
