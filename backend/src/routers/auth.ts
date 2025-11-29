import { Router } from 'express';
import register from '../controllers/auth/register';
import login from '../controllers/auth/login';
import validation from '../middlewares/validation';
import { registerValidator, loginValidator } from '../validators/auth.validator';

const router = Router();

// POST /api/auth/register - Register a new user
router.post('/register', validation(registerValidator), register);

// POST /api/auth/login - Login user
router.post('/login', validation(loginValidator), login);

export default router;
