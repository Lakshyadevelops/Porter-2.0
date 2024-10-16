const {
  userAuthentication,
  restrictTo,
} = require("../controller/authController");
const { signup, login, tryBooking } = require("../controller/userController");

const userRouter = require("express").Router();

userRouter.route("/auth/signup").post(signup);
userRouter.route("/auth/login").post(login);
userRouter
  .route("/book")
  .post(userAuthentication, restrictTo("USER"), tryBooking);

module.exports = userRouter;
