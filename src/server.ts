/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression({
    threshold: 1024 // Only compress responses that are larger than 1KB
}));
app.use(cookieParser());
app.use(limiter);

(async () => {
    try {
        app.get('/', (req, res) => {
            res.json({
                message: 'Hello World'
            });
        });

        app.listen(config.PORT, () => {
            console.log(`Server is running on http://localhost:${config.PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        if (config.NODE_ENV !== 'development') {
            console.log('Exiting process...');
            process.exit(1);
        }
    }
})();