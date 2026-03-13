import {
  TransactionRepository,
  CreateTransactionData,
} from '../repositories/transaction.repository';

export const TransactionService = {

  async findByMonth(month: number, year: number, userId: string) {
    // Validamos se o mês faz sentido antes de ir ao banco
    if (month < 1 || month > 12) {
      throw new Error('Mês inválido. Deve ser entre 1 e 12.');
    }
    return await TransactionRepository.findByMonth(month, year, userId);
  },

  async create(data: CreateTransactionData) {
    // Mantemos suas validações de negócio
    if (!data.description || data.description.trim().length < 3) {
      throw new Error('A descrição deve ter pelo menos 3 caracteres.');
    }

    if (data.amount <= 0) {
      throw new Error('O valor da transação deve ser maior que zero.');
    }

    // O Repository usará o data.userId que já está dentro do objeto 'data'
    const transaction = await TransactionRepository.create(data);
    return transaction;
  },

  async findAll(userId: string) {
    return await TransactionRepository.findAll(userId);
  },

  async update(id: string, userId: string, data: Partial<CreateTransactionData>) {
    if (data.status === 'paid' && !data.paymentDate) {
      data.paymentDate = new Date();
    }

    // Passamos o userId para garantir que só o dono atualize
    const transaction = await TransactionRepository.update(id, userId, data);
    
    if (!transaction) {
      throw new Error('Transação não encontrada ou você não tem permissão.');
    }
    
    return transaction;
  },

  async delete(id: string, userId: string) {
    // Aqui garantimos que o 'delete' só ocorra se o dono for o mesmo do token
    const result = await TransactionRepository.delete(id, userId);
    
    // Se o Prisma não deletar nada (porque o ID ou User não batem), avisamos o erro
    if (result.count === 0) {
      throw new Error('Não foi possível excluir: transação não encontrada ou sem permissão.');
    }
  },
};