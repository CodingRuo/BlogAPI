/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { login } from '@/controllers/v1/auth/login';
import { refreshToken } from '@/controllers/v1/auth/refresh-tokens';
import { register } from '@/controllers/v1/auth/register';
import { Router } from 'express';
import { cookie } from 'express-validator';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh-token',
    cookie('refreshToken')
        .notEmpty()
        .withMessage('Refresh token required'),
    refreshToken
);

export { authRouter };
