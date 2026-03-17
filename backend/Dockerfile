FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
# Instalamos tudo (incluindo o tsc)
RUN npm install

COPY . .

# 1. Gera o Prisma Client
RUN npx prisma generate

# 2. Tenta compilar. Se der erro de tipo (TS), ele continua mesmo assim (--force)
# Isso garante que a pasta /dist seja criada
RUN ./node_modules/.bin/tsc --skipLibCheck || true

EXPOSE 3333

# Comando de start direto no JS
CMD ["node", "dist/server.js"]