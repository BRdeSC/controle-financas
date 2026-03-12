# 1. Node base
FROM node:22-alpine

# 2. Pasta de trabalho
WORKDIR /app

# 3. Instalamos as dependências do React
COPY package*.json ./
RUN npm install

# 4. Copiamos o nosso código lindo do Frontend
COPY . .

# 5. O Vite roda na porta 5173
EXPOSE 5173

# 6. Ligamos o Vite (o --host é OBRIGATÓRIO no Docker para a tela aparecer no seu navegador)
CMD ["npm", "run", "dev", "--", "--host"]
