# Usa una imagen oficial de Node.js
FROM node:18

# Crea directorio de trabajo
WORKDIR /usr/src/app

# Copia package.json y package-lock.json primero (para aprovechar cache de dependencias)
COPY package*.json ./

# Instala dependencias
RUN npm install --omit=dev

# Copia el resto del código
COPY . .

# Expone el puerto que Cloud Run usará
EXPOSE 8080

# Define la variable de entorno PORT
ENV PORT=8080

# Comando de inicio
CMD [ "npm", "start" ]
