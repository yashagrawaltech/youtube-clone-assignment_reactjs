import httpResponseCodes from '../constants.js';
import asyncHandler from '../handlers/asyncHandler.js';
import Comment from '../models/comment.model.js';
import Video from '../models/video.model.js';
import { ApiError, ApiResponse } from '../utils/utils.js';

export const addComment = asyncHandler(async (req, res) => {
    const { text, videoId } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
        return res
            .status(httpResponseCodes.BadRequest)
            .json(
                new ApiError(httpResponseCodes.BadRequest, 'video not found')
            );
    }

    const comment = await Comment.create({
        text,
        videoId,
        userId: req.user._id,
    });

    if (!comment) {
        throw new Error('error saving comment in the database');
    }

    video.comments.push(comment._id);
    await video.save();

    res.status(httpResponseCodes.Created).json(
        new ApiResponse(
            httpResponseCodes.Created,
            'comment added successfully',
            { comment }
        )
    );
});
