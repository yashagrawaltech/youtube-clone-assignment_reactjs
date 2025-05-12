import jwt from 'jsonwebtoken';
import config from '../config.js';
import { v2 as cloudinary } from 'cloudinary';

export function decodeAuthToken(token) {
    try {
        const decodedToken = jwt.verify(token, config.jwt_secret);
        return decodedToken; // Returns decoded token data if valid
    } catch (error) {
        return null; // Returns null if token is invalid
    }
}

export class ApiResponse {
    constructor(statusCode, message, data) {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
    }
}

export class ApiError extends Error {
    success = false;
    stack;

    constructor(statusCode, message, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;

        // Make `message` enumerable
        Object.defineProperty(this, 'message', {
            value: message,
            enumerable: true,
            writable: true,
        });

        // Capture the stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        if (config.node_env !== 'development') {
            this.stack = undefined;
        }
    }
}
