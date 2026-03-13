import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware'; // Importe o middleware

const transactionRoutes = Router();

console.log(">>> ARQUIVO DE ROTAS DE TRANSAÇÃO FOI LIDO PELO NODE <<<");

// Aplica o middleware em todas as rotas abaixo
// A partir daqui, NINGUÉM passa sem o Token JWT
transactionRoutes.use(authMiddleware);

// Rota para CRIAR (POST /transactions)
transactionRoutes.post('/', TransactionController.create);

// Rota para FILTRAR (GET /transactions/filter)
transactionRoutes.get('/filter', TransactionController.listByMonth);

// Rota para LISTAR (GET /transactions)
transactionRoutes.get('/', TransactionController.list);

// Rota para ATUALIZAR (PUT /transactions/:id)
transactionRoutes.put('/:id', TransactionController.update);

// Rota para EXCLUIR (DELETE /transactions/:id)
transactionRoutes.delete('/:id', TransactionController.delete);

export default transactionRoutes;