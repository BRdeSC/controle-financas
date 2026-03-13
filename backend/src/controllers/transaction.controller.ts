import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';

export const TransactionController = {

  async listByMonth(req: Request, res: Response) {
    try {
      const { month, year } = req.query;
      const userId = (req as any).userId;
      if (!month || !year) {
        return res.status(400).json({ error: "Mês e Ano são obrigatórios na URL." });
      }

      // Passamos o userId para o service filtrar apenas as DESTE usuário
      const transactions = await TransactionService.findByMonth(
        Number(month),
        Number(year),
        userId 
      );

      return res.status(200).json(transactions);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao filtrar transações.' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).userId; // Pegue aqui
      const transaction = await TransactionService.create({ ...req.body, userId });
      return res.status(201).json(transaction);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      // MUDE AQUI: Estava pegando de req.body, mude para o (req as any)
      const userId = (req as any).userId; 
      const transactions = await TransactionService.findAll(userId);
      return res.status(200).json(transactions);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro interno ao buscar transações.' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const userId = (req as any).userId; // Pegue aqui
      const data = req.body; 

      const transaction = await TransactionService.update(id, userId, data);
      return res.status(200).json(transaction);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const userId = (req as any).userId; // Pegue aqui

      await TransactionService.delete(id, userId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },
};