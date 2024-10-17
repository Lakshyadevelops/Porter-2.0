const {
  driverAuthentication,
  restrictTo,
} = require("../controller/authController");
const { signup, login, logout, updateLocation } = require("../controller/driverController");

const driverRouter = require("express").Router();

driverRouter.route("/auth/signup").post(signup);
driverRouter.route("/auth/login").post(login);

driverRouter
  .route("/logout")
  .post(driverAuthentication, restrictTo("DRIVER"), logout);

driverRouter
  .route("/location")
  .post(driverAuthentication, restrictTo("DRIVER"), updateLocation);

module.exports = driverRouter;
