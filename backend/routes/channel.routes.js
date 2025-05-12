import { Router } from 'express';
import {
    handleValidationErrors,
    protectedRoute,
    upload,
} from '../middlewares/commonMiddlewares.js';
import { validateChannel } from '../validators/channel.validators.js';
import {
    createChannel,
    getAllVideos,
    getChannelById,
} from '../controllers/channel.controllers.js';

const router = Router();

router.get('/:id/videos', getAllVideos);
router.get('/:id', getChannelById);

router.post(
    '/create',
    protectedRoute, // ensure the user is authenticated
    upload.single('channelBanner'), // handle the banner file upload
    validateChannel, // validate the request body and file
    handleValidationErrors, // handle any validation errors
    createChannel // proceed to create the channel
);

export default router;
