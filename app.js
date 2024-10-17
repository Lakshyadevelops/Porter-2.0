require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");

const userRouter = require("./route/userRoute");
const driverRouter = require("./route/driverRoute");
const globalErrorHandler = require("./controller/errorController");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const sequelize = require("./config/database");

const app = express();

app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/driver", driverRouter);

const init = catchAsync(async () => {
  await sequelize.sync({ force: true });
  console.log("All models were synchronized successfully.");
});
init();

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
