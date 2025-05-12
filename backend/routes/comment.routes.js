import { Router } from 'express';
import {
    handleValidationErrors,
    protectedRoute,
} from '../middlewares/commonMiddlewares.js';
import { validateComment } from '../validators/comment.validators.js';
import { addComment } from '../controllers/comment.controllers.js';

const router = Router();

router.post(
    '/add',
    protectedRoute,
    validateComment,
    handleValidationErrors,
    addComment
);

export default router;
