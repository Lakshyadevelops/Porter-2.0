const sequelize = require("../../config/database");
const { Sequelize } = require("sequelize");
const booking = require("./booking");
const bcrypt = require("bcrypt");

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
    status: {
      allowNull: false,
      type: Sequelize.ENUM("ACTIVE", "INACTIVE", "BLOCKED", "HOLD"),
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
    modelName: "driver",
  }
);

booking.belongsTo(driver, {
  foreignKey: "driver_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

driver.hasMany(booking, {
  foreignKey: "driver_id",
  sourceKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// await booking.sync({alter:true});

module.exports = driver;
