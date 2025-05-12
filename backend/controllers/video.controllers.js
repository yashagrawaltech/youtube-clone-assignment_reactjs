import mongoose from 'mongoose';
import httpResponseCodes from '../constants.js';
import asyncHandler from '../handlers/asyncHandler.js';
import Channel from '../models/channel.model.js';
import Video from '../models/video.model.js';
import { ApiError, ApiResponse } from '../utils/utils.js';
import Comment from '../models/comment.model.js';

export const uploadVideo = asyncHandler(async (req, res) => {
    // check if the user owns a channel
    const { channelId } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel)
        return res
            .status(httpResponseCodes.BadRequest)
            .json(
                new ApiError(httpResponseCodes.BadRequest, 'channel not found')
            );

    if (channel.owner.toString() !== req.user._id.toString())
        return res
            .status(httpResponseCodes.BadRequest)
            .json(
                new ApiError(
                    httpResponseCodes.BadRequest,
                    'user does not own a channel'
                )
            );

    const { title, description, category } = req.body;

    // check if files are uploaded
    if (!req.files || !req.files.thumbnailFile || !req.files.videoFile) {
        return res
            .status(httpResponseCodes.BadRequest)
            .json(
                new ApiError(
                    httpResponseCodes.BadRequest,
                    'thumbnail and video files are required'
                )
            );
    }

    // retrieve the urls from cloudinary (path is the actual url)
    const thumbnailUrl = req.files.thumbnailFile[0].path;
    const videoUrl = req.files.videoFile[0].path;

    if (!thumbnailUrl || !videoUrl) {
        throw new Error();
    }

    // create new video document in the database
    const newVideo = await Video.create({
        title,
        thumbnailUrl, // store the actual url here
        videoUrl, // store the actual url here
        description,
        category,
        channelId: channel._id,
        uploader: req.user._id,
    });

    // add the new video to the channel's video list
    channel.videos.push(newVideo._id);
    await channel.save();

    res.status(httpResponseCodes.Created).json(
        new ApiResponse(
            httpResponseCodes.Created,
            'video uploaded successfully',
            { video: newVideo }
        )
    );
});

export const deleteVideo = asyncHandler(async (req, res) => {
    const videoId = req.params.id;

    const video = await Video.findById(videoId);
    if (!video) {
        return res
            .status(httpResponseCodes.NotFound)
            .json(new ApiError(httpResponseCodes.NotFound, 'video not found'));
    }

    if (video.uploader.toString() !== req.user._id.toString()) {
        return res
            .status(httpResponseCodes.Forbidden)
            .json(
                new ApiError(httpResponseCodes.Forbidden, 'unauthorized action')
            );
    }

    await Channel.updateOne(
        { _id: video.channelId },
        { $pull: { videos: video._id } }
    );

    await Comment.deleteMany({ videoId: video._id });

    await video.deleteOne();

    res.status(httpResponseCodes.OK).json(
        new ApiResponse(httpResponseCodes.OK, 'video deleted successfully')
    );
});

export const getAllVideos = asyncHandler(async (req, res) => {
    const { category, limit = 100 } = req.query;

    let videos = [];

    if (category && category.toString().trim() !== '') {
        videos = await Video.find({
            category: category.toString().trim().toLowerCase(),
        })
            .populate('channelId uploader')
            .limit(Number(limit));
    } else {
        videos = await Video.find()
            .populate('channelId uploader')
            .limit(Number(limit));
    }

    res.status(httpResponseCodes.OK).json(
        new ApiResponse(httpResponseCodes.OK, 'videos fetched successfully', {
            videos,
        })
    );
});

export const getVideoById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
        return res
            .status(httpResponseCodes.NotFound)
            .json(new ApiError(httpResponseCodes.NotFound, 'video not found'));
    }

    const video = await Video.findById(id).populate(
        'uploader channelId comments'
    );
    if (!video) {
        return res
            .status(httpResponseCodes.NotFound)
            .json(new ApiError(httpResponseCodes.NotFound, 'video not found'));
    }

    res.status(httpResponseCodes.OK).json(
        new ApiResponse(httpResponseCodes.OK, 'video fetched successfully', {
            video,
        })
    );
});

export const searchVideosByTitle = asyncHandler(async (req, res) => {
    const { title, limit = 50 } = req.query;

    if (!title || title.trim() === '') {
        return res
            .status(httpResponseCodes.BadRequest)
            .json(
                new ApiError(
                    httpResponseCodes.BadRequest,
                    'title query is required'
                )
            );
    }

    const videos = await Video.aggregate([
        {
            $match: {
                title: { $regex: title, $options: 'i' },
            },
        },
        { $limit: parseInt(limit) },
        {
            $project: {
                title: 1,
                _id: 1,
            },
        },
    ]);

    res.status(httpResponseCodes.OK).json(
        new ApiResponse(
            httpResponseCodes.OK,
            'search results fetched successfully',
            { videos }
        )
    );
});

export const likeVideo = asyncHandler(async (req, res) => {
    const videoId = req.params.id;

    const video = await Video.findById(videoId);
    if (!video) {
        return res
            .status(httpResponseCodes.NotFound)
            .json(new ApiError(httpResponseCodes.NotFound, 'video not found'));
    }

    video.likes += 1;
    await video.save();

    res.status(httpResponseCodes.OK).json(
        new ApiResponse(httpResponseCodes.OK, 'video liked successfully', {
            likes: video.likes,
        })
    );
});

export const dislikeVideo = asyncHandler(async (req, res) => {
    const videoId = req.params.id;

    const video = await Video.findById(videoId);
    if (!video) {
        return res
            .status(httpResponseCodes.NotFound)
            .json(new ApiError(httpResponseCodes.NotFound, 'video not found'));
    }

    video.dislikes += 1;
    await video.save();

    res.status(httpResponseCodes.OK).json(
        new ApiResponse(httpResponseCodes.OK, 'video disliked successfully', {
            dislikes: video.dislikes,
        })
    );
});

export const editVideo = asyncHandler(async (req, res) => {
    const videoId = req.params.id;
    // Validate video ID
    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        return res
            .status(httpResponseCodes.NotFound)
            .json(new ApiError(httpResponseCodes.NotFound, 'video not found'));
    }
    // Find the video
    const video = await Video.findById(videoId);
    if (!video) {
        return res
            .status(httpResponseCodes.NotFound)
            .json(new ApiError(httpResponseCodes.NotFound, 'video not found'));
    }
    // Check if the user is the owner of the video
    if (video.uploader.toString() !== req.user._id.toString()) {
        return res
            .status(httpResponseCodes.Forbidden)
            .json(
                new ApiError(httpResponseCodes.Forbidden, 'unauthorized action')
            );
    }
    // Update the video fields
    const { title, description } = req.body;
    // Only update fields that are provided
    if (title) {
        video.title = title;
    }
    if (description) {
        video.description = description;
    }
    // Save the updated video
    await video.save();
    res.status(httpResponseCodes.OK).json(
        new ApiResponse(httpResponseCodes.OK, 'video updated successfully', {
            video,
        })
    );
});
