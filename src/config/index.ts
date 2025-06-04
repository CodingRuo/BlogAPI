/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV,
    WHITELIST_ORIGINS: ['http://localhost:3000'],
    MONGODB_URI: process.env.MONGODB_URI
};

export default config;