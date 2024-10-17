const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { generateToken } = require("./authController");
const driver = require("../db/models/driver");
const vehicle = require("../db/models/vehicle");
const redisClient = require("../config/redisClient");

const signup = catchAsync(async (req, res, next) => {
  const body = req.body;

  const newVehicle = await vehicle.create({
    type: body.type,
    capacity: body.capacity,
    plateNumber: body.plateNumber,
  });

  if (!newVehicle) {
    return next(new AppError("Failed to create vehicle", 400));
  }

  const newDriver = await driver.create({
    name: body.name,
    email: body.email,
    phone: body.phone,
    password: body.password,
    confirmPassword: body.confirmPassword,
    status: "ACTIVE",
    vehicle_id: newVehicle.id,
  });

  if (!newDriver) {
    await newVehicle.destroy();
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

const logout = catchAsync(async (req, res, next) => {
  console.log("driver logout");
  const driver_id = req.user.id;
  await redisClient.zRem(`driver:location`, `${driver_id}`);
});

const updateLocation = catchAsync(async (req, res, next) => {
  console.log("driver update location");
  const driver_id = req.user.id;
  await redisClient.zRem(`driver:location`, `${driver_id}`);
  console.log("working");
  await redisClient.geoAdd(`driver:location`, [
    {
      latitude: req.body.lat,
      longitude: req.body.long,
      member: `${driver_id}`,
    },
  ]);
});
console.log("worked");


module.exports = { signup, login, logout, updateLocation };
