import { body } from 'express-validator';

export const validateComment = [
    body('text').notEmpty().withMessage('Comment text is required'),

    body('videoId')
        .notEmpty()
        .withMessage('Video ID is required')
        .isMongoId()
        .withMessage('Invalid video ID'),
];
