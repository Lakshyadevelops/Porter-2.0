const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message;
  const stack = err.stack;

  res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

const sendErrorProd = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message;
  const stack = err.stack;

  if (err.isOperational) {
    res.status(statusCode).json({
      status,
      message,
    });
  }
  console.log(err.name, err.message, stack);
  return res.status(500).json({
    status: "Error",
    message: "Something went wrong",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid token", 401);
  }
  if (err.name === "SequelizeValidationError") {
    err = new AppError(err.errors[0].message, 400);
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    err = new AppError(err.errors[0].message, 400);
  }
  if (process.env.NODE_ENV === "production") {
    return sendErrorProd(err, res);
  } else {
    sendErrorDev(err, res);
  }
};
module.exports = globalErrorHandler;
