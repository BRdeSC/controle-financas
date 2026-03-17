# 1. Escolhemos o "computador" base (Node.js leve)
FROM node:22-alpine

# 2. Criamos uma pasta lá dentro chamada /app
WORKDIR /app

# 3. Copiamos o "caderno de receitas" (package.json) e instalamos as dependências
COPY package*.json ./
RUN npm install

# 4. Copiamos todo o nosso código para dentro do contentor
COPY . .

# 5. Geramos o cliente do Prisma para este novo sistema (Linux)
RUN npx prisma generate

# 6. Avisamos a porta (O Render vai ler isso aqui)
EXPOSE 3333

# 7. O COMANDO DE PRODUÇÃO (A MÁGICA)
# Removemos os colchetes [] para o shell do Linux entender o "&&"
CMD npx prisma db push && npm run dev
