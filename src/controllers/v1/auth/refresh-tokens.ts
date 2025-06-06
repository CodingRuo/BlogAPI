/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import { Token } from "@/models/token";
import { Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Types } from "mongoose";

const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken as string;

    try {

        const jwtPayload = verifyRefreshToken(refreshToken) as { userId: Types.ObjectId };

        const tokenDoc = await Token.findOne({ userId: jwtPayload.userId }).select('+token');

        if (!tokenDoc) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token'
            });
            return;
        }

        // Gehashten Token vergleichen
        const isValidToken = await tokenDoc.compareToken(refreshToken);

        if (!isValidToken) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token'
            });
            return;
        }

        const accessToken = generateAccessToken(jwtPayload.userId);

        res.status(200).json({
            accessToken
        });

    } catch (error) {

        if (error instanceof TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Refresh token expired, please login again'
            });
            return;
        }

        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token'
            });

            return;
        }

        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error
        });

        logger.error('Error during refresh token', error);
    }
}

export { refreshToken };
