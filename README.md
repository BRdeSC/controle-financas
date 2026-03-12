# 📊 Sistema de Controle de Finanças (SaaS)

Uma aplicação Full-Stack moderna para gestão de finanças pessoais. Este projeto foi arquitetado em um modelo **Monorepo** e é 100% conteinerizado usando **Docker**, garantindo que o ambiente de desenvolvimento seja idêntico ao de produção.

## 🚀 Tecnologias Utilizadas

O projeto foi construído com as tecnologias mais modernas do mercado:

### 💻 Frontend (Interface)
* **React.js** com **Vite** (Rápido e otimizado)
* **TypeScript** para tipagem estática
* Consumo de API via **Axios**

### ⚙️ Backend (API)
* **Node.js (v22)** com **Express**
* **TypeScript**
* **Prisma ORM** para modelagem e comunicação com o banco de dados
* **Jest & Supertest** para Testes Automatizados de Integração (TDD)
* **ESLint & Prettier** para padronização e qualidade de código

### 🐳 Infraestrutura & DevOps
* **Docker & Docker Compose** (Ambiente isolado e padronizado)
* **MySQL 8.0** (Banco de dados relacional)

---

## 📂 Estrutura do Projeto (Monorepo)

```text
app-financas/
├── docker-compose.yml   # Maestro da infraestrutura (sobe o Front, Back e BD juntos)
├── frontend/            # Aplicação React (Roda na porta 5173)
└── backend/             # API Node.js (Roda na porta 3333)


🛠️ Como Executar o Projeto Localmente
Como a aplicação é totalmente dockerizada, você não precisa ter o Node.js ou o MySQL instalados nativamente na sua máquina. Apenas o Docker e o Docker Compose são necessários.

Passo 1: Iniciar os Contêineres
Na raiz do projeto (onde está o arquivo docker-compose.yml), execute o comando abaixo para baixar as imagens, instalar as dependências e subir os servidores:

Bash
docker compose up -d --build


Passo 2: Sincronizar o Banco de Dados
Na primeira vez que rodar o projeto, o banco MySQL nascerá vazio. Execute o comando abaixo para que o Prisma crie as tabelas automaticamente dentro do contêiner:

Bash
docker exec -it financas-api npx prisma db push
Passo 3: Acessar a Aplicação
Frontend (Aplicação Web): Abra o navegador em http://localhost:5173

Backend (API): Responde em http://localhost:3333

Banco de Dados (Acesso externo): Exposto na porta 3308 do seu localhost (usuário: root / senha: root)

🧪 Como Rodar os Testes Automatizados
O backend possui testes de integração para garantir a estabilidade das regras de negócio e rotas da API.

Entre na pasta do backend:

Bash
cd backend
Execute o script de testes (Jest):

Bash
npm test
(Nota: Certifique-se de que o arquivo .env do backend está apontando para a porta 3308 do localhost para os testes funcionarem corretamente).

🛑 Como Parar a Aplicação
Para desligar todos os servidores e limpar a rede virtual do Docker (mantendo os dados do banco salvos):

Bash
docker compose down
