/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { logger } from '@/lib/winston';
import { IUser } from '@/models/user';
import { Request, Response } from 'express';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body as UserData;

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