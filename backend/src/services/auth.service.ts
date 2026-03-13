import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const AuthService = {
  async register(name: string, email: string, password: string) {
    const userExists = await UserRepository.findByEmail(email);
    if (userExists) {
      throw new Error('Este e-mail já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserRepository.create({
      name,
      email,
      password: hashedPassword
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // --- NOVO MÉTODO DE LOGIN ---
  async login(email: string, password: string) {
    // 1. Busca o usuário pelo e-mail
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('E-mail ou senha inválidos.');
    }

    // 2. Compara a senha digitada com o hash que está no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('E-mail ou senha inválidos.');
    }

    // 3. Gera o Token JWT (o "crachá" digital)
    // O token contém o id do usuário e expira em 1 dia
    const token = jwt.sign(
      { userId: user.id }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // 4. Retorna os dados do usuário e o token para o Frontend
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
};
