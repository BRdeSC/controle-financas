import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTransactionData {
  description: string;
  amount: number;
  type: string;
  dueDate: Date;
  paymentDate?: Date;
  status?: string;
  userId: string; // <-- Essencial agora!
}

export const TransactionRepository = {

  async findByMonth(month: number, year: number, userId: string) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return await prisma.transaction.findMany({
      where: {
        userId, // Filtra pelo dono
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        dueDate: 'desc',
      },
    });
  },

  async create(data: CreateTransactionData) {
    return await prisma.transaction.create({
      data: {
        description: data.description,
        amount: data.amount,
        type: data.type,
        dueDate: data.dueDate,
        paymentDate: data.paymentDate,
        status: data.status,
        // Em vez de passar o campo userId direto, usamos a conexão de objeto
        user: {
          connect: { id: data.userId }
        }
      },
    });
  },

  async findAll(userId: string) {
    return await prisma.transaction.findMany({
      where: { userId }, // Só traz as transações do dono do token
      orderBy: {
        dueDate: 'asc',
      },
    });
  },

  async update(id: string, userId: string, data: Partial<CreateTransactionData>) {
    // Usamos updateMany para garantir que o id pertença ao userId
    const updateResult = await prisma.transaction.updateMany({
      where: { 
        id: id,
        userId: userId 
      },
      data: {
        description: data.description,
        amount: data.amount,
        type: data.type,
        dueDate: data.dueDate,
        paymentDate: data.paymentDate,
        status: data.status,
      },
    });

    // Como updateMany não retorna o objeto, buscamos ele se houve alteração
    if (updateResult.count > 0) {
      return await prisma.transaction.findUnique({ where: { id } });
    }
    return null;
  },

  async delete(id: string, userId: string) {
    // Segurança máxima: só deleta se o ID e o User baterem
    return await prisma.transaction.deleteMany({
      where: { 
        id: id,
        userId: userId 
      },
    });
  },
};