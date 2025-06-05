/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { logger } from '@/lib/winston';
import { Request, Response } from 'express';

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(201).json({
            message: 'New user registered successfully',
        });
    } catch (error) {
        res.status(500).json({
            code: 'SaveError',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });

        logger.error('Error registering user:', error);
    }
};

export default register;