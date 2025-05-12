import { body } from 'express-validator';
import User from '../models/user.model.js';

export const validateUser = [
    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .isString()
        .withMessage('Username must be a string'),

    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('Email already in use');
            }
            return true;
        }),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

export const validateUserForLogin = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: value }).select(
                '+password'
            );
            if (!user) {
                throw new Error('Email or password is incorrect');
            }
            req.user = user; // attach user to req for password validation
            return true;
        }),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .custom(async (value, { req }) => {
            const user = req.user;
            if (!user) throw new Error('Email or password is incorrect');

            const isMatch = await user.comparePassword(value);
            if (!isMatch) throw new Error('Email or password is incorrect');

            return true;
        }),
];
