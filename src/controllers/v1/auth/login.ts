/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { config } from "@/config";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import { Token } from "@/models/token";
import { IUser, User } from "@/models/user";
import { Request, Response } from "express";

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as UserData;

        const user = await User.authenticate(email, password);

        if (!user) {
            res.status(401).json({
                code: 'Unauthorized',
                message: 'Invalid email or password'
            });
            return;
        }

        // ✅ SINGLE-SESSION: Lösche alle bestehenden Tokens (egal ob gültig oder nicht)
        const deletedCount = await Token.deleteMany({ userId: user._id });

        if (deletedCount.deletedCount > 0) {
            logger.info('Replaced existing session for user', {
                userId: user._id,
                deletedTokens: deletedCount.deletedCount
            });
        }

        // Generate access token and refresh token for new user;
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await Token.create({ token: refreshToken, userId: user._id });

        logger.info('Refresh token created for user', {
            userid: user._id,
            token: refreshToken,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(201).json({
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken
        });

        logger.info('User logged in successfully', user);

    } catch (error) {
        res.status(500).json({
            code: 'SaveError',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });

        logger.error('Error registering user:', error);
    }
}

export { login };
