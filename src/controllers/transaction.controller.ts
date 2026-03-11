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
  },

  async list(req: Request, res: Response) {
    try {
      const transactions = await TransactionService.findAll();
      return res.status(200).json(transactions);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro interno ao buscar transações." });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id; // Pega o ID que vem na URL (ex: /transactions/123)
      const data = req.body;    // Pega os dados que queremos mudar (ex: { status: "paid" })

      const transaction = await TransactionService.update(id, data);
      
      return res.status(200).json(transaction);
    } catch (error: any) {
      return res.status(400).json({ error: "Erro ao atualizar a transação. Verifique se o ID está correto." });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id; // Pega o ID da URL

      await TransactionService.delete(id);
      
      // Status 204 significa "No Content" (Sucesso, mas não tem nada para devolver na tela)
      return res.status(204).send(); 
    } catch (error: any) {
      return res.status(400).json({ error: "Erro ao excluir. Verifique se o ID existe." });
    }
  }

};
