/**
 * @copyright 2025 CodingRuo-Development
 * @license Apache-2.0
 */

import bcrypt from 'bcrypt';
import { GetLeanResultType, Model, model, Schema } from "mongoose";

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    firstName?: string;
    lastName?: string;
    socialLinks?: {
        website?: string;
    };
};

export interface IUserModel extends Model<IUser> {
    authenticate(email: string, password: string): Promise<GetLeanResultType<IUser, IUser, 'findOne'> | null>
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        maxlength: [20, 'Username must be less than 20 characters'],
        unique: [true, 'Username must be unique'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        maxlength: [50, 'Email must be less than 50 characters'],
        unique: [true, 'Email must be unique'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: {
            values: ['admin', 'user'],
            message: '{VALUE} is not supported'
        },
        default: 'user',
    },
    firstName: {
        type: String,
        maxlength: [20, 'First name must be less than 20 characters'],
    },
    lastName: {
        type: String,
        maxlength: [20, 'Last name must be less than 20 characters'],
    },
    socialLinks: {
        website: {
            type: String,
            maxlength: [100, 'Website must be less than 100 characters'],
        }
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.authenticate = async function (this: Model<IUser>, email: string, password: string) {
    const user = await this.findOne({ email }).select('username email password role').lean().exec();


    if (!user) {
        return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    return isMatch ? user : null;
};

const User = model<IUser, IUserModel>('User', userSchema);

export { User };
