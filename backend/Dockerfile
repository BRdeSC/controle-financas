FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
# Instalamos tudo, inclusive o TypeScript para o build
RUN npm install

COPY . .

# Fazemos o build e o prisma generate AQUI no build, não no comando final
RUN npx prisma generate
RUN npm run build

EXPOSE 3333

# O comando final agora é DIRETO e RÁPIDO
# Tiramos o db push daqui para o servidor ligar instantaneamente
CMD ["node", "dist/server.js"]