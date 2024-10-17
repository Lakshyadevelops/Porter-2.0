const sequelize = require("../../config/database");
const { Sequelize } = require("sequelize");
const booking = require("./booking");
const driver = require("./driver");

const vehicle = sequelize.define(
  "vehicle",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    type: {
      allowNull: false,
      type: Sequelize.ENUM("BIKE", "TRUCK"),
    },
    plateNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{1,4}$/,
      },
    },
    capacity: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  },
  {
    modelName: "vehicle",
  }
);

vehicle.hasOne(driver, {
  foreignKey: "vehicle_id",
  sourceKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

driver.belongsTo(vehicle, {
  foreignKey: "vehicle_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

vehicle.hasMany(booking, {
  foreignKey: "vehicle_id",
  sourceKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

booking.belongsTo(vehicle, {
  foreignKey: "vehicle_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// await booking.sync({alter:true});
// await driver.sync({alter:true});

module.exports = vehicle;
