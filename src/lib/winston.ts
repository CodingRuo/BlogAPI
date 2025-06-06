/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import { config } from '@/config';
import winston from 'winston';

const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;

const transports: winston.transport[] = [];

if (config.NODE_ENV === 'development') {
    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
                align(),
                printf(({ level, message, timestamp, ...metadata }) => {
                    const metaString = Object.keys(metadata).length ? `\n${JSON.stringify(metadata)}` : '';
                    return `${timestamp} [${level}]: ${message}${metaString}`;
                })
            )
        })
    )
}

const logger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports,
    silent: config.NODE_ENV === 'test'
});

export { logger };
