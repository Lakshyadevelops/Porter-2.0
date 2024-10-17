const {
  userAuthentication,
  restrictTo,
  driverAuthentication,
} = require("../controller/authController");

const {
  book,
  cancel,
  accept,
  get,
  statusUpdate,
} = require("../controller/bookingController");

const bookingRouter = require("express").Router();

bookingRouter.route("/book").post(userAuthentication, restrictTo("USER"), book);

bookingRouter
  .route("/cancel")
  .post(userAuthentication, restrictTo("USER"), cancel);

bookingRouter
  .route("/accept")
  .post(driverAuthentication, restrictTo("DRIVER"), accept);

bookingRouter
  .route("/book")
  .get(driverAuthentication, restrictTo("DRIVER"), get);

bookingRouter
  .route("/status")
  .post(driverAuthentication, restrictTo("DRIVER"), statusUpdate);

module.exports = bookingRouter;
