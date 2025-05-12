const asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            next(
                error instanceof Error
                    ? error
                    : new Error('Something went wrong')
            );
        }
    };
};

export default asyncHandler;
