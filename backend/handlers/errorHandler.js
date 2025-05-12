import httpResponseCodes from '../constants.js';
import { ApiError } from '../utils/utils.js';

export const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res
            .status(err.statusCode || httpResponseCodes.InternalServerError)
            .json(
                new ApiError(
                    err.statusCode,
                    err.message || 'Something went wrong',
                    err.errors || null
                )
            );
    } else if (err instanceof Error) {
        return res
            .status(httpResponseCodes.InternalServerError)
            .json(
                new ApiError(
                    httpResponseCodes.InternalServerError,
                    err.message || 'Something went wrong',
                    null
                )
            );
    } else {
        return res
            .status(httpResponseCodes.InternalServerError)
            .json(
                new ApiError(
                    httpResponseCodes.InternalServerError,
                    'An unknown error occurred',
                    null
                )
            );
    }
};
