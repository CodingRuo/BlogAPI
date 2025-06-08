/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { config } from "@/config";
import { logger } from "@/lib/winston";
import { Token } from "@/models/token";
import { Request, Response } from "express";

const logout = async (req: Request, res: Response) => {
    try {
        await Token.deleteMany({ userId: req.userId });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.sendStatus(204);

        logger.info('User logged out successfully', {
            userId: req.userId
        });
    } catch (error) {
        res.status(500).json({
            code: 'SaveError',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });

        logger.error('Error during logout:', error);
    }
};

export { logout };
