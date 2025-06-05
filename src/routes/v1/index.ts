/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import authRoutes from '@/routes/v1/auth';
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        docs: 'https://github.com/CodingRuo-Development/api-docs',
        timestamp: new Date().toISOString()
    });
});

router.use('/auth', authRoutes);

export default router;