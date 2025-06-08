/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { Types } from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            userId?: Types.ObjectId
        }
    }
}