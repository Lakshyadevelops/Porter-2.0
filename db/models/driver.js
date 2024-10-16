const sequelize = require("../../config/database");
const { Sequelize } = require("sequelize");

const driver = sequelize.define(
  "driver",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    email: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
      validate: {
        len: [10, 10],
        isNumeric: true,
      },
    },
    vehicle_id: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
    },
    active: {
      allowNull: false,
      type: Sequelize.ENUM("ACTIVE", "INACTIVE", "BLOCKED", "HOLD"),
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING,
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
    modelName: "driver",
  }
);

module.exports = driver;
