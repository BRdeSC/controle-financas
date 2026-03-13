import { PrismaClient } from '@prisma/client';

// Essa instância será usada por toda a aplicação
export const prisma = new PrismaClient();

export { prisma };
