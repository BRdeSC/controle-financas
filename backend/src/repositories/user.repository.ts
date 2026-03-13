import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserRepository = {
  async create(data: any) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      }
    });
  },

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }
};
