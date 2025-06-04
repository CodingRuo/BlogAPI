/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import config from '@/config';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
});