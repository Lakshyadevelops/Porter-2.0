const { Scooty, TruckType1 } = require("../config/vehicles");
const redisClient = require("../config/redisClient");
const catchAsync = require("../utils/catchAsync");
const booking = require("../db/models/booking");
const user = require("../db/models/user");

//TODO: Implement surge pricing
const SURGE_MULTIPLIER = 0;
const USER_BOOKING_EXPIRY = 300;

const book = catchAsync(async (req, res, next) => {
  console.log("user book");

  const userId = req.user.id;
  const src = {
    lat: req.body.src_lat,
    long: req.body.src_long,
  };
  const dest = {
    lat: req.body.dest_lat,
    long: req.body.dest_long,
  };
  console.log(req.body);
  let price = NaN;
  if (req.body.vehicleType === "BIKE")
    price = await Scooty.priceEstimate(src, dest, SURGE_MULTIPLIER);
  else
    price = await TruckType1.priceEstimate(
      req.body.vehicleType,
      SURGE_MULTIPLIER
    );

  await redisClient.hSet(`user:${userId}`, {
    vehicleType: req.body.vehicleType,
    amount: `${price}`,
    drop_lat: req.body.dest_lat,
    drop_long: req.body.dest_long,
    booking_id: "null",
  });

  await redisClient.geoAdd(`book:pickup`, [
    {
      latitude: req.body.src_lat,
      longitude: req.body.src_long,
      member: `${userId}`,
    },
  ]);

  await redisClient.expire(`user:${userId}`, USER_BOOKING_EXPIRY);

  res.status(200).json({
    status: "success",
  });
});

// Currently we can only cancel the booking if it is not accepted by any driver
const cancel = catchAsync(async (req, res, next) => {
  console.log("user cancel");
  const userId = req.user.id;
  await redisClient.del(`user:${userId}`);
  await redisClient.zRem(`book:pickup`, `${userId}`);
  res.status(200).json({
    status: "success",
  });
});

const get = catchAsync(async (req, res, next) => {
  const driver_lat = req.body.driver_lat;
  const driver_long = req.body.driver_long;
  const vehicleType = req.body.vehicleType;

  const result = await redisClient.geoSearch(
    `book:pickup`,
    { latitude: driver_lat, longitude: driver_long },
    { radius: 10, unit: "km" },
    { COUNT: 5, WITHCOORD: true, WITHDIST: true }
  );

  //  do filtering based on vehicle type and distance
  console.log(result);

  res.status(200).json({
    status: "success",
    data: res,
  });
});

const accept = catchAsync(async (req, res, next) => {
  console.log("driver accept");
  const driver_id = req.body.driver_id;
  //   const vehicleType = req.body.vehicleType;
  const user_id = req.body.user_id;
  const amount = req.body.amount;
  const pickup = req.body.pickup;
  const drop = req.body.drop;

  await booking.create({
    driver_id: driver_id,
    user_id: user_id,
    // vehicleType:vehicleType,
    price: amount,
    pickup: pickup,
    drop: drop,
    status: "BOOKED",
  });

  await redisClient.hSet(`user:${user_id}`, {
    booking_id: booking.id,
  });

  await redisClient.hSet(`booking:${booking.id}`, {
    status: "BOOKED",
  });

  res.status(200).json({
    status: "success",
  });
});

const statusUpdate = catchAsync(async (req, res, next) => {
  console.log("driver status update");
  const booking_id = req.body.booking_id;

  await redisClient.hSet(`booking:${booking_id}`, {
    status: booking_id,
  });
});

module.exports = {
  book,
  cancel,
  accept,
  get,
  statusUpdate,
};
