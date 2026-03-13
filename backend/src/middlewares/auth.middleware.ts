import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 1. Pega o token que vem no cabeçalho 'Authorization'
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const parts = authHeader.split(' ');
  const token = parts[1];

  console.log("Header completo:", authHeader);
  console.log("Token extraído:", token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).userId = decoded.userId;
    return next();
  } catch (err: any) {
    console.log("--- ERRO NA VALIDAÇÃO DO TOKEN ---");
    console.log("Mensagem:", err.message);
    console.log("Secret usado no Middleware:", JWT_SECRET);
    return res.status(401).json({ 
      error: 'Token inválido ou expirado.',
      details: err.message // Isso vai aparecer no seu terminal (curl)
    });
  }
};
