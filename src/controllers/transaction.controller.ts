import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';

export const TransactionController = {
  async create(req: Request, res: Response) {
    try {
      // 1. Pega os dados que vieram no corpo da requisição (JSON)
      const data = req.body;

      // 2. Passa para o Service fazer a mágica e aplicar as regras
      const transaction = await TransactionService.create(data);

      // 3. Devolve a transação criada com o status 201 (Created)
      return res.status(201).json(transaction);
      
    } catch (error: any) {
      // Se o Service lançou um erro (ex: valor menor que zero), cai aqui no catch
      // Status 400 significa "Bad Request" (O cliente mandou algo errado)
      return res.status(400).json({ error: error.message });
    }
  }
};
