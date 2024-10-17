const { Scooty, TruckType1 } = require("../config/rates");
const redisClient = require("../config/redisClient");
const catchAsync = require("../utils/catchAsync");

const tryBooking = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  let price;
  if (req.body.vehicle_type === "BIKE")
    price = Scooty.calculatePrice(req.body.vehicle_type, 0);
  else price = TruckType1.calculatePrice(req.body.vehicle_type, 0);

  await redisClient.hSet(`user:${userId}`, {
    src_lat: req.body.src_lat,
    src_long: req.body.src_long,
    dest_lat: req.body.dest_lat,
    dest_long: req.body.dest_long,
    vehicle_type: req.body.vehicle_type,
    amount: `${price}`,
  });

  await redisClient.expire(`user:${userId}`, 300); // Set key to expire in 5 minutes
});

const cancelBooking = catchAsync(async (req, res, next) => {});

const acceptBooking = catchAsync(async (req, res, next) => {});

module.exports = { tryBooking, cancelBooking, acceptBooking };
