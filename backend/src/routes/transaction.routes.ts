import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';

const transactionRoutes = Router();

// Rota para CRIAR uma transação (POST)
transactionRoutes.post('/transactions', TransactionController.create);

// 2. Rota para FILTRAR transações por mês (GET)
// Adicionamos ANTES da rota de ID para evitar conflitos
transactionRoutes.get('/transactions/filter', TransactionController.listByMonth);

// Rota para LISTAR as transações (GET)
transactionRoutes.get('/transactions', TransactionController.list);

// Rota para ATUALIZAR uma transação específica (PUT)
// O ":id" avisa o Express que ali virá um valor dinâmico
transactionRoutes.put('/transactions/:id', TransactionController.update);

// Rota para EXCLUIR uma transação específica (DELETE)
transactionRoutes.delete('/transactions/:id', TransactionController.delete);

export default transactionRoutes;
