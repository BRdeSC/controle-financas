import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';

const transactionRoutes = Router();

// Rota para CRIAR uma transação (POST)
transactionRoutes.post('/transactions', TransactionController.create);

export default transactionRoutes;
