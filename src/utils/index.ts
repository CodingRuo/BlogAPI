/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

export const genUsername = (): string => {
    const userNamePrefix = 'user-';
    const randomChars = Math.random().toString(36).slice(2);

    const username = userNamePrefix + randomChars;
    return username;
}