const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { generateToken } = require("./authController");
const driver = require("../db/models/driver");
const vehicle = require("../db/models/vehicle");

const signup = catchAsync(async (req, res, next) => {
  const body = req.body;

  const newDriver = await driver.create({
    name: body.name,
    email: body.email,
    phone: body.phone,
    password: body.password,
    confirmPassword: body.confirmPassword,
    status: "ACTIVE",
    vehicle: {
      type: body.type,
      capacity: body.capacity,
      plateNumber: body.plateNumber,
    },
    include: [vehicle],
  });

  if (!newDriver) {
    return next(new AppError("Failed to create user", 400));
  }

  const result = newDriver.toJSON();

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

  const result = await driver.findOne({
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

module.exports = { signup, login };
