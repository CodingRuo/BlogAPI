/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { verifyAccessToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Types } from "mongoose";

/**
 * @function authenticate
 * @description Middleware to verify the users's ID is attached to the request object.
 *              If the token is valid, the user's ID is attached to the request object.
 *              Otherwise, it returns an appropriate error response.
 * @param {Request} req - Express request object. Expects a Bearer token in the Authorization header.
 * @param {Response} res - Express response object used to send error respinse if authentication fails.
 * @param {NextFunction} next - Express function to pass control to the next middleware.
 * 
 * @returns {void}
 */
const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    // If there's no Bearer token, respond with 401 Unauthorized
    if (!authHeader?.startsWith('Bearer')) {
        res.send(401).json({
            code: 'AuthenticationError',
            message: 'Access denied, no token provided',
        });
        return;
    }

    // Split out the token from the "Bearer" prefix;
    const [_, token] = authHeader.split(' ');

    try {
        // Verify the token and extract the userId from the payload
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

        // Attach the userId to the request object for later use
        req.userId = jwtPayload.userId;

        // Proceed to the next middleware or route handler
        return next();
    } catch (error) {
        // Handle expired token error
        if (error instanceof TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token expired, request a new one with refresh token',
            });
            return;
        }

        // Handle invalid token error
        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token invalid',
            });
            return;
        }

        // Catch-all for other errors
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error,
        });

        logger.error('Error during authentication', error);
    }
};

export { authenticate };
