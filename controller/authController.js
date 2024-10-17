const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const user = require("../db/models/user");
const driver = require("../db/models/driver");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const restrictTo = (...roles) => {
  const checkPermission = (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    return next();
  };
  return checkPermission;
};

const userAuthentication = catchAsync(async (req, res, next) => {
  let idtToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idtToken = req.headers.authorization.split(" ")[1];
  }
  if (!idtToken) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  const tokenDetail = jwt.verify(idtToken, process.env.JWT_SECRET_KEY);

  const freshUser = await user.findByPk(tokenDetail.id);
  if (!freshUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  req.user = freshUser;
  return next();
});

const driverAuthentication = catchAsync(async (req, res, next) => {
  let idtToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idtToken = req.headers.authorization.split(" ")[1];
  }
  if (!idtToken) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  const tokenDetail = jwt.verify(idtToken, process.env.JWT_SECRET_KEY);

  const freshDriver = await driver.findByPk(tokenDetail.id);
  if (!freshDriver) {
    return next(
      new AppError(
        "The driver belonging to this token does no longer exist.",
        401
      )
    );
  }
  req.user = freshDriver;
  return next();
});

module.exports = {
  restrictTo,
  userAuthentication,
  driverAuthentication,
  generateToken,
};
