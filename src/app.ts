import express from 'express';
import transactionRoutes from './routes/transaction.routes'; // <-- Importamos as rotas aqui

const app = express();

app.use(express.json());

// Rota de teste
app.get('/health', (request, response) => {
  return response.status(200).json({ status: 'OK' });
});

// Plugar as rotas de transações no Express!
app.use(transactionRoutes); // <-- Adicionamos esta linha

export default app;
