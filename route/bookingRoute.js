const {
  userAuthentication,
  restrictTo,
  driverAuthentication,
} = require("../controller/authController");
const {
  tryBooking,
  cancelBooking,
  acceptBooking,
} = require("../controller/bookingController");

const bookingRouter = require("express").Router();

bookingRouter
  .route("/try")
  .post(userAuthentication, restrictTo("USER"), tryBooking);

bookingRouter
  .route("/cancel")
  .post(userAuthentication, restrictTo("USER"), cancelBooking);

bookingRouter
  .route("/accept")
  .post(driverAuthentication, restrictTo("DRIVER"), acceptBooking);

module.exports = bookingRouter;
