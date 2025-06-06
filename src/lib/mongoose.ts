/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { config } from "@/config";
import mongoose, { ConnectOptions } from "mongoose";
import { logger } from "./winston";

const clientOptions: ConnectOptions = {
    dbName: 'blog-db',
    appName: 'Blog API',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
}

export const connectToDatabase = async (): Promise<void> => {
    if (!config.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    try {
        await mongoose.connect(config.MONGODB_URI, clientOptions);
        logger.info('Connected to the database successfully', {
            uri: config.MONGODB_URI,
            options: clientOptions
        });
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        logger.error('Error connecting to MongoDB:', error);
    }
}

export const disconnectFromDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        logger.info('Disconnected from the database successfully', {
            uri: config.MONGODB_URI,
            options: clientOptions
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        logger.error('Error disconnecting from MongoDB:', error);
    }
}