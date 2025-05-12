import { validationResult } from 'express-validator';
import User from '../models/user.model.js';
import { ApiError, decodeAuthToken } from '../utils/utils.js';
import asyncHandler from '../handlers/asyncHandler.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import multer from 'multer';
import httpResponseCodes from '../constants.js';

export const handleValidationErrors = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg || 'Validation failed');
        error.statusCode = 400;
        error.errors = errors.array(); // attach all validation errors for reference
        return next(error); // pass to global error handler
    }

    next();
});

export const protectedRoute = asyncHandler(async (req, res, next) => {
    /* 
    
    * this middleware is used to protect routes that require user authentication. 
    * it checks for a valid authentication token in the request cookies or headers. 
    * if the token is missing or invalid, it responds with a 401 unauthorized status. 
    * if the token is valid, it decodes the token, retrieves the user from the database, 
    * and attaches the user object to the request for further processing. 
    * if the user is not found, it also responds with a 401 unauthorized status.

    */

    // console.log(req.cookies)
    // console.log(req.headers)

    const token =
        (req.cookies && req.cookies.authToken) ||
        (req.headers['authorization'] &&
            req.headers['authorization'].split(' ')[1]);

    // console.log(token);

    if (!token)
        return res
            .status(httpResponseCodes.Unauthorized)
            .json(
                new ApiError(
                    httpResponseCodes.Unauthorized,
                    'unauthorized access'
                )
            );

    const decodedToken = decodeAuthToken(token);
    if (!decodedToken)
        return res
            .status(httpResponseCodes.Unauthorized)
            .json(
                new ApiError(
                    httpResponseCodes.Unauthorized,
                    'unauthorized access'
                )
            );

    // console.log(decodedToken);

    const user = await User.findById(decodedToken.id);
    if (!user)
        return res
            .status(httpResponseCodes.Unauthorized)
            .json(
                new ApiError(
                    httpResponseCodes.Unauthorized,
                    'unauthorized access'
                )
            );

    // console.log(user);

    req.user = user;
    next();
});

export const publicRoute = asyncHandler(async (req, res, next) => {
    /* 
    
    * this middleware is used when we optionally want the user to be authenticated. 
    * if the user is authenticated, we can perform certain actions, but user authentication is not required.
    
    */

    // console.log(req.cookies)
    // console.log(req.headers)

    const token =
        (req.cookies && req.cookies.authToken) ||
        (req.headers['authorization'] &&
            req.headers['authorization'].split(' ')[1]);

    // console.log(token);

    const decodedToken = decodeAuthToken(token);

    // console.log(decodedToken);

    const user = await User.findById(decodedToken?.id);

    req.user = user;
    next();
});

// Multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let folder = 'youtube-clone/others';
        let resourceType = 'image'; // default to image

        // set folder and resource type based on the fieldname
        if (file.fieldname === 'thumbnailFile') {
            folder = 'youtube-clone/thumbnails';
        } else if (file.fieldname === 'videoFile') {
            folder = 'youtube-clone/videos';
            resourceType = 'video'; // set to video resource type for video files
        } else if (file.fieldname === 'channelBanner') {
            folder = 'youtube-clone/channel-banners';
        }

        return {
            folder,
            resource_type: resourceType, // set appropriate resource type (image or video)
            public_id: `${Date.now()}-${file.originalname}`, // unique public id based on current timestamp
        };
    },
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB max for all files by default
    },
    fileFilter: (req, file, cb) => {
        const isImage = file.mimetype.startsWith('image/');
        const isVideo = file.mimetype.startsWith('video/');

        if (isImage && file.size > 5 * 1024 * 1024) {
            return cb(new Error('Image file size should not exceed 5MB'));
        }

        if (isVideo && file.size > 10 * 1024 * 1024) {
            return cb(new Error('Video file size should not exceed 10MB'));
        }

        cb(null, true); // accept file
    },
});
