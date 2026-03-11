import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Formato dos dados que o Repository espera receber
export interface CreateTransactionData {
  description: string;
  amount: number;
  type: string;
  dueDate: Date;
  paymentDate?: Date; // Opcional
  status?: string;    // Opcional
}

export const TransactionRepository = {
  // Função para criar uma transação na base de dados
  async create(data: CreateTransactionData) {
    const transaction = await prisma.transaction.create({
      data: {
        description: data.description,
        amount: data.amount,
        type: data.type,
        dueDate: data.dueDate,
        paymentDate: data.paymentDate,
        status: data.status,
      },
    });
    
    return transaction;
  },

  async findAll() {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        dueDate: 'asc' // Já traz ordenado pela data de vencimento (das mais antigas para as mais novas)!
      }
    });
    return transactions;
  },

  // Função para atualizar uma transação existente
  async update(id: string, data: Partial<CreateTransactionData>) {
    const transaction = await prisma.transaction.update({
      where: { id: id },
      data: {
        description: data.description,
        amount: data.amount,
        type: data.type,
        dueDate: data.dueDate,
        paymentDate: data.paymentDate,
        status: data.status,
      }
    });
    return transaction;
  },

  // Função para excluir uma transação
  async delete(id: string) {
    const transaction = await prisma.transaction.delete({
      where: { id: id }
    });
    return transaction;
  }

};
