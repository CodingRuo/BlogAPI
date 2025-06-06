/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import bcrypt from 'bcrypt';
import { Schema, Types, model } from "mongoose";

interface IToken {
    token: string;
    userId: Types.ObjectId;
    expiresAt?: Date
}

const tokenSchema = new Schema<IToken>({
    token: {
        type: String,
        required: true,
        select: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 Tage
        index: { expireAfterSeconds: 0 } // ← MongoDB TTL - automatisches Löschen
    }
}, {
    timestamps: true
});

tokenSchema.pre('save', async function (next) {
    if (!this.isModified('token')) {
        next();
        return;
    }

    this.token = await bcrypt.hash(this.token, 10);
    next();
});

tokenSchema.methods.compareToken = async function (candidateToken: string): Promise<boolean> {
    return bcrypt.compare(candidateToken, this.token);
};

const Token = model<IToken>('Token', tokenSchema);

export { Token };
