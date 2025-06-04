/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import v1Routes from '@/routes/v1';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';

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

/**
 * Immediately Invoked Function Expression (IIFE) to start the server.
 * 
 * - Defines the API route (`/api/v1`).
 * - Starts the server on the specified PORT and logs the URL to the console.
 * - If an error occurs during startup, it is logged, and the process exits with status code 1.
 */
(async () => {
    try {

        await connectToDatabase();

        app.use('/api/v1', v1Routes);

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

/**
 * Handles eerver shutdown greacetully by disconnectiong from the databae.
 * 
 * - Attempts to disconnect from the database before shutting down the server.
 * - Logs a success message if the disconnection is successful.
 * - I an error occurs during disconnection, it is logged to the console.
 * - Exists the process with status code 0 (indication a successful shutdown)
 */

const handleServerShutdown = async () => {
    try {
        console.log('Server is shutting down...');
        await disconnectFromDatabase();
        process.exit(0);
    } catch (error) {
        console.error('Error during server shutdown:', error);
    }
}

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);

// 9rtScJjcN1WO1Wyr