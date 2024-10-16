const catchAsync = (fn) => {
    const errHandler = (req, res, next) => {
        fn(req, res, next).catch(next);
    }
    return errHandler;
};

module.exports = catchAsync;