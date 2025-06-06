/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 60, // allow a maximum of 60 requests per window per IP
    standardHeaders: 'draft-8', // use the latest standard rate-limit headers
    legacyHeaders: false, // disable the `X-RateLimit-*` headers
    message: {
        error: 'You have sent too many request in a given amount of time. Please try again later.'
    }
});

export { limiter };
