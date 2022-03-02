import { body } from 'express-validator';
import express from 'express';

import { signUp, login } from '../controllers/auth-controllers';

const router = express.Router();

router.post('/sign-up', [
    body('email').normalizeEmail().isEmail(),
    body('password').trim().isLength({ min: 6 }),
], signUp);

router.post('/login', [
    body('email').normalizeEmail().isEmail(),
    body('password').trim().isLength({ min: 6 })
], login);

export { router as authRouter };