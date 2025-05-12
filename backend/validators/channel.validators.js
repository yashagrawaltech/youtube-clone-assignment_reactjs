import { body } from 'express-validator';

export const validateChannel = [
    body('channelName').notEmpty().withMessage('Channel name is required'),

    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),

    // validate channelbanner (ensure the file is present)
    body('channelBanner').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Channel banner file is required');
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            throw new Error(
                'Invalid banner file type. Allowed types are jpeg, png, and jpg.'
            );
        }

        if (req.file.size > 5000000) {
            // 5mb limit for banners
            throw new Error('Channel banner file size must be less than 5MB.');
        }

        return true;
    }),
];
