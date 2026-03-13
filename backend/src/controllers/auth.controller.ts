import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await AuthService.register(name, email, password);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.login(email, password);
    
    // Retorna status 200 (OK) com o usuário e o token
    res.status(200).json(data);
  } catch (error: any) {
    // 401 significa que as credenciais são inválidas
    res.status(401).json({ error: error.message });
  }
};