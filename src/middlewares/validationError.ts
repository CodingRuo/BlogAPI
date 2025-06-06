/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validationError = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            code: 'ValdiationErropr',
            errors: errors.mapped()
        });
        return;
    }

    next();
}

export { validationError };
