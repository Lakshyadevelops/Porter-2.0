const { signup, login } = require("../controller/driverController");

const driverRouter = require("express").Router();

driverRouter.route("/auth/signup").post(signup);
driverRouter.route("/auth/login").post(login);


module.exports = driverRouter;
