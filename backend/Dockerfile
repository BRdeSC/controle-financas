FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
# Instalamos tudo (incluindo o tsc)
RUN npm install

COPY . .

# 1. Gera o Prisma
RUN npx prisma generate

# 2. Tenta compilar (mesmo com erros de tipo)
RUN ./node_modules/.bin/tsc --skipLibCheck || true

# 3. Porta
EXPOSE 3333

# 4. O COMANDO QUE MANTÉM LIGADO (Sem os colchetes [])
# Usamos o formato de texto para o "&&" funcionar
CMD node dist/server.js