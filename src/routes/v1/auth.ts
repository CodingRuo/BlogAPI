/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { register } from '@/controllers/v1/auth/register';
import { validationError } from '@/middlewares/validationError';
import { User } from '@/models/user';
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
        .withMessage('Invalid email address')
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if (userExists) {
                throw new Error('User email or password is invalid')
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('role')
        .optional()
        .isString()
        .withMessage('Role must be a string')
        .isIn(['admin', 'user'])
        .withMessage('Role must be either admin or user'),
    validationError,
    register
);

export { authRouter };
