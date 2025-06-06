/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { register } from '@/controllers/v1/auth/register';
import { validationError } from '@/middlewares/validationError';
import { Router } from 'express';
import { body } from 'express-validator';

const authRouter = Router();

authRouter.post('/register',
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 50 })
        .withMessage('Email must be less than 50 characters')
        .isEmail()
        .withMessage('Invalid email address'),
    validationError,
    register
);

export { authRouter };
