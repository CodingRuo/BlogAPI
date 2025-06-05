/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import config from '@/config';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import User, { IUser } from '@/models/user';
import { genUsername } from '@/utils';
import { Request, Response } from 'express';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body as UserData;

    console.log({ email, password, role });

    try {
        const username = genUsername();

        const newUser = await User.create({
            username,
            email,
            password,
            role
        });

        // Generate access token and refresh token for new user;
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(201).json({
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            accessToken
        });

        logger.info('User registered successfully', {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
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