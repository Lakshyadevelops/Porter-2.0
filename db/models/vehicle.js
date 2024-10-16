const sequelize = require("../../config/database");

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
    vehicle_number: {
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

module.exports = vehicle;
