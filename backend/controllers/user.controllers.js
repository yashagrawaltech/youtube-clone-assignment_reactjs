import mongoose from 'mongoose';
import asyncHandler from '../handlers/asyncHandler.js';
import User from '../models/user.model.js';
import httpResponseCodes from '../constants.js';
import { ApiError, ApiResponse } from '../utils/utils.js';

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(httpResponseCodes.OK)
        .json(
            new ApiResponse(
                httpResponseCodes.OK,
                'user data fetched successfully',
                { user: req.user }
            )
        );
});

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id))
        return res
            .status(httpResponseCodes.BadRequest)
            .json(new ApiError(httpResponseCodes.BadRequest, 'user not found'));

    const user = await User.findById(id);

    if (!user)
        return res
            .status(httpResponseCodes.BadRequest)
            .json(new ApiError(httpResponseCodes.BadRequest, 'user not found'));

    return res
        .status(httpResponseCodes.OK)
        .json(
            new ApiResponse(
                httpResponseCodes.OK,
                'user data fetched successfully',
                { user }
            )
        );
});

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userData = {
        username,
        email,
        password,
    };

    // console.log(userData);

    const user = await User.insertOne(userData);
    if (!user) {
        throw new Error(
            'something went wrong while saving user in the database'
        );
    }

    // console.log(user);

    // verifying whether user is saved or not
    const savedUser = await User.findOne({ email });
    if (!savedUser) {
        throw new Error(
            'something went wrong while saving user in the database'
        );
    }

    // console.log(savedUser);

    // generating user auth token
    const token = await savedUser.generateAuthToken();
    if (!token) {
        throw new Error('something went wrong while generating auth token');
    }

    // console.log(token);

    // setting cookie options
    const cookieOptions = {
        httpOnly: true, // prevents client-side javascript from accessing the cookie
        secure: false, // use secure cookies in production
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // set cookie expiration to 1 day
        sameSite: 'Lax', // safer default for local dev
    };

    return res
        .status(httpResponseCodes.Created)
        .cookie('authToken', token, cookieOptions)
        .json(
            new ApiResponse(
                httpResponseCodes.Created,
                'user registered successfully',
                { user: savedUser, token }
            )
        );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { user } = req;
    // console.log(user)

    const token = user.generateAuthToken();

    const cookieOptions = {
        httpOnly: true, // prevents client-side javascript from accessing the cookie
        secure: false, // use secure cookies in production
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // set cookie expiration to 1 day
        sameSite: 'Lax', // safer default for local dev
    };

    user.password = undefined;

    return res
        .status(httpResponseCodes.OK)
        .cookie('authToken', token, cookieOptions)
        .json(
            new ApiResponse(
                httpResponseCodes.OK,
                'user loggedin successfully',
                { user, token }
            )
        );
});
