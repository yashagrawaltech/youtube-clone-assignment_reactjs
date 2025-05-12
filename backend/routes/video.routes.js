import { Router } from 'express';
import {
    validateEditVideo,
    validateVideo,
} from '../validators/video.validators.js';
import {
    handleValidationErrors,
    protectedRoute,
    upload,
} from '../middlewares/commonMiddlewares.js';
import {
    deleteVideo,
    dislikeVideo,
    editVideo,
    getAllVideos,
    getVideoById,
    likeVideo,
    searchVideosByTitle,
    uploadVideo,
} from '../controllers/video.controllers.js';

const router = Router();

router.get('/', getAllVideos);

router.post(
    '/upload',
    protectedRoute,
    upload.fields([
        { name: 'thumbnailFile', maxCount: 1 },
        { name: 'videoFile', maxCount: 1 },
    ]),
    validateVideo,
    handleValidationErrors,
    uploadVideo // Final controller
);

router.put('/:id/like', likeVideo);
router.put('/:id/dislike', dislikeVideo);

router.put(
    '/:id',
    protectedRoute,
    validateEditVideo,
    handleValidationErrors,
    editVideo
);

router.delete('/:id', protectedRoute, deleteVideo);

router.get('/search', searchVideosByTitle);
router.get('/:id', getVideoById);

export default router;
