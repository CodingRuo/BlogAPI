/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import express from 'express';
import config from './config';

const app = express();

app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
});