import mongoose from 'mongoose';
import httpResponseCodes from '../constants.js';
import asyncHandler from '../handlers/asyncHandler.js';
import Channel from '../models/channel.model.js';
import { ApiError, ApiResponse } from '../utils/utils.js';
import Video from '../models/video.model.js';

export const createChannel = asyncHandler(async (req, res) => {
    const { channelName, description } = req.body;

    // if the file is not uploaded, return a validation error
    if (!req.file) {
        return res
            .status(httpResponseCodes.BadRequest)
            .json(
                new ApiError(
                    httpResponseCodes.BadRequest,
                    'channel banner file is required'
                )
            );
    }

    // get the cloudinary url (secure_url) for the uploaded file
    const bannerUrl = req.file.path;

    if (!bannerUrl) {
        throw new Error('error while uploading banner');
    }

    // create the new channel
    const newChannel = await Channel.create({
        channelName,
        description,
        channelBanner: bannerUrl, // store the cloudinary url
        owner: req.user.id,
    });

    req.user.channels.push(newChannel._id); // add the channel id to the user's channels array
    await req.user.save(); // save the user document

    res.status(201).json(
        new ApiResponse(
            httpResponseCodes.Created,
            'channel created successfully',
            { channel: newChannel }
        )
    );
});

export const getChannelById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id))
        return res
            .status(httpResponseCodes.BadRequest)
            .json(
                new ApiError(httpResponseCodes.BadRequest, 'channel not found')
            );

    const channel = await Channel.findById(id);

    if (!channel) {
        return res
            .status(httpResponseCodes.BadRequest)
            .json(
                new ApiError(httpResponseCodes.BadRequest, 'channel not found')
            );
    }

    return res
        .status(httpResponseCodes.OK)
        .json(
            new ApiResponse(
                httpResponseCodes.OK,
                'channel data fetched successfully',
                { channel }
            )
        );
});

export const getAllVideos = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id))
        return res
            .status(httpResponseCodes.BadRequest)
            .json(
                new ApiError(httpResponseCodes.BadRequest, 'channel not found')
            );

    const channel = await Channel.findById(id);

    if (!channel) {
        return res
            .status(httpResponseCodes.BadRequest)
            .json(
                new ApiResponse(
                    httpResponseCodes.BadRequest,
                    'Channel not found'
                )
            );
    }

    const videos = await Video.find({
        channelId: channel._id,
    });

    res.status(httpResponseCodes.OK).json(
        new ApiResponse(httpResponseCodes.OK, 'videos fetched successfully', {
            videos,
        })
    );
});
