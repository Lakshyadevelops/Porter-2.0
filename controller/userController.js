const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const redisClient = require("../config/redisClient");
const { generateToken } = require("./authController");


const signup = catchAsync(async (req, res, next) => {
  const body = req.body;
  if (!["admin", "user"].includes(body.role)) {
    throw new AppError("Invalid role", 400);
  }
  const newUser = await user.create({
    name: body.name,
    role: body.role,
    email: body.email,
    phone: body.phone,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  if (!newUser) {
    return next(new AppError("Failed to create user", 400));
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({
    id: result.id,
  });

  return res.status(201).json({
    status: "success",
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const result = await user.findOne({
    where: {
      email: email,
    },
  });

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = generateToken({
    id: result.id,
  });

  return res.json({
    status: "success",
    token,
  });
});

const tryBooking = catchAsync(async (req, res, next) => {
  redisClient.set("booking", JSON.stringify(req.body));

});

module.exports = { signup, login ,tryBooking};
