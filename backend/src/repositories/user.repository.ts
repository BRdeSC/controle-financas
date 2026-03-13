import { prisma } from '../lib/prisma';

export const UserRepository = {
  async findByEmail(email: string) {
    // Adicione esse log temporário para debug no teste
    if (!prisma) { console.error("PRISMA ESTÁ UNDEFINED NO REPOSITORY"); }
    
    return await prisma.user.findUnique({
      where: { email }
    });
  },

  async create(data: any) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      }
    });
  }
};