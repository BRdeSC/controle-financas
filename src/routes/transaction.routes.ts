import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';

const transactionRoutes = Router();

// Rota para CRIAR uma transação (POST)
transactionRoutes.post('/transactions', TransactionController.create);

// Rota para LISTAR as transações (GET)
transactionRoutes.get('/transactions', TransactionController.list);

// Rota para ATUALIZAR uma transação específica (PUT)
// O ":id" avisa o Express que ali virá um valor dinâmico
transactionRoutes.put('/transactions/:id', TransactionController.update);

// Rota para EXCLUIR uma transação específica (DELETE)
transactionRoutes.delete('/transactions/:id', TransactionController.delete);

export default transactionRoutes;
