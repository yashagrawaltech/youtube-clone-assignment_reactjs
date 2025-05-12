import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config.js';
import connectToMongoDB from './db.js';
import asyncHandler from './handlers/asyncHandler.js';
import { errorHandler } from './handlers/errorHandler.js';
import { ApiError, ApiResponse } from './utils/utils.js';
import httpResponseCodes from './constants.js';

// Routers
import userRouter from './routes/user.routes.js';
import channelRouter from './routes/channel.routes.js';
import videoRouter from './routes/video.routes.js';
import commentRouter from './routes/comment.routes.js';

// App Initialization
const app = express();
const port = config.port;

// Common Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:5173', // Allow all origins
        credentials: true,
    })
);

// Logger Middleware
app.use(
    asyncHandler((req, res, next) => {
        res.on('finish', () => {
            // Log the request method, URL, and response status code when the response is finished
            console.log(
                `[${req.method}] ${req.originalUrl} -> ${res.statusCode}`
            );
        });
        next();
    })
);

// Health Check Route
app.get(
    '/api/health',
    asyncHandler(async (req, res) => {
        res.status(httpResponseCodes.OK).json(
            new ApiResponse(httpResponseCodes.OK, 'health ok')
        );
    })
);

// Routes
app.use('/api/user', userRouter);
app.use('/api/channel', channelRouter);
app.use('/api/video', videoRouter);
app.use('/api/comment', commentRouter);

// Not-found Middleware
app.use(
    asyncHandler(async (req, res) => {
        res.status(httpResponseCodes.NotFound).json(
            new ApiError(httpResponseCodes.NotFound, 'route not found')
        );
    })
);

// Error Middleware
app.use(errorHandler);

// Server Initialization
const server = app.listen(port, () => {
    const host = server.address().address; // Get the server address
    const port = server.address().port; // Get the server port
    console.log(
        `Server running at http://${host === '::' ? 'localhost' : host}:${port}`
    );
    connectToMongoDB();
});
