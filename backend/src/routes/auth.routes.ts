import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

// Rota para cadastrar um novo usuário
router.post('/register', register);
router.post('/login', login);

export default router;
