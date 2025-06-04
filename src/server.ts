/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import config from '@/config';
import cors, { CorsOptions } from 'cors';
import express from 'express';

const app = express();

const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS error: ${origin} not allowed by CORS`), false);
        }
    }
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
});