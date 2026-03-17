# 1. Escolhemos o "computador" base (Node.js leve)
FROM node:22-alpine

# 2. Criamos uma pasta lá dentro chamada /app
WORKDIR /app

# 3. Copiamos o "caderno de receitas" (package.json) e instalamos as dependências
COPY package*.json ./
RUN npm install

# 4. Copiamos todo o nosso código para dentro do contentor
COPY . .

# 5. Gerar o Prisma Client e o Build do TypeScript
RUN npx prisma generate
RUN npm run build

# 6. Porta
EXPOSE 3333

# 7. O Comando de Produção (Roda o código compilado)
# Isso faz o servidor ligar em 1 segundo, evitando o timeout
CMD npx prisma db push && node dist/server.js