"use strict";
const { Sequelize } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require("bcrypt");
const AppError = require("../../utils/appError");
const booking = require("./booking");

const user = sequelize.define(
  "user",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is required",
        },
        notEmpty: {
          msg: "Name is required",
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email is required",
        },
        notEmpty: {
          msg: "Email is required",
        },
        isEmail: {
          msg: "Invalid email",
        },
      },
    },
    phone: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [10, 10],
        isNumeric: true,
        notNull: {
          msg: "Phone is required",
        },
        notEmpty: {
          msg: "Phone is required",
        },
      },
    },
    role: {
      type: Sequelize.ENUM("ADMIN", "USER"),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      // validate: {
      //   notNull: {
      //     msg: "password cannot be null",
      //   },
      //   notEmpty: {
      //     msg: "password cannot be empty",
      //   },
      //   len: {
      //     args: [8, 20],
      //     msg: "password must be between 8 and 20 characters",
      //   },
      // },
    },
    confirmPassword: {
      type: Sequelize.VIRTUAL,
      set(value) {
        if (value === this.password) {
          const hashPassword = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hashPassword);
        } else {
          throw new AppError(
            "Password and confirm password must be the same",
            400
          );
        }
      },
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
    modelName: "user",
  }
);

booking.belongsTo(user, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

user.hasMany(booking, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// await booking.sync({alter:true});

module.exports = user;
