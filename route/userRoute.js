const {
  userAuthentication,
  restrictTo,
} = require("../controller/authController");
const { signup, login } = require("../controller/userController");

const userRouter = require("express").Router();

userRouter.route("/auth/signup").post(signup);
userRouter.route("/auth/login").post(login);

module.exports = userRouter;
