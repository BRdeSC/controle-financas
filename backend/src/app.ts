import express from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transaction.routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors()); // <-- 2. Avisando o Express para permitir ligações externas
app.use(express.json());

// Rota de teste
app.get('/health', (request, response) => {
  return response.status(200).json({ status: 'OK' });
});

// Plugar as rotas de transações no Express!
app.use('/auth', authRoutes);
console.log("Tentando carregar rotas de transação...");

app.use('/transactions', transactionRoutes);
console.log("Rotas de transação plugadas!");

export default app;
