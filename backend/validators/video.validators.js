import { body } from 'express-validator';

// video validation - 1
export const validateVideo = [
    body('title').notEmpty().withMessage('Video title is required'),

    body('channelId')
        .notEmpty()
        .withMessage('Channel ID is required')
        .isMongoId()
        .withMessage('Invalid Channel ID'),

    body('description').optional().isString(),

    body('category').optional().isString(),

    // thumbnail file validation
    body('thumbnailFile').custom((value, { req }) => {
        if (
            !req.files ||
            !req.files.thumbnailFile ||
            req.files.thumbnailFile.length === 0
        ) {
            throw new Error('Thumbnail file is required');
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(req.files.thumbnailFile[0].mimetype)) {
            throw new Error(
                'Invalid thumbnail file type. Allowed types are jpeg, png, and jpg.'
            );
        }
        if (req.files.thumbnailFile[0].size > 5000000) {
            // 5mb limit
            throw new Error('Thumbnail file size must be less than 5MB.');
        }
        return true;
    }),

    // video file validation
    body('videoFile').custom((value, { req }) => {
        if (
            !req.files ||
            !req.files.videoFile ||
            req.files.videoFile.length === 0
        ) {
            throw new Error('Video file is required');
        }
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!allowedTypes.includes(req.files.videoFile[0].mimetype)) {
            throw new Error(
                'Invalid video file type. Allowed types are mp4, webm, and ogg.'
            );
        }
        if (req.files.videoFile[0].size > 10000000) {
            // 10mb limit
            throw new Error('Video file size must be less than 100MB.');
        }
        return true;
    }),
];

export const validateEditVideo = [
    body('title')
        .optional()
        .notEmpty()
        .withMessage('Video title cannot be empty if provided'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
];
