/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { register } from '@/controllers/v1/auth/register';
import { Router } from 'express';
import { body } from 'express-validator';

const router = Router();

router.post('/register',
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 50 })
        .withMessage('Email must be less than 50 characters')
        .isEmail()
        .withMessage('Invalid email address')
    , register);

export default router;