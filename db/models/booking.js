const sequelize = require("../../config/database");
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;
const payment = require("./payment");

const booking = sequelize.define(
  "booking",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    pickup: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
    drop: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM(
        "BOOKED",
        "EN ROUTE TO PICKUP",
        "GOODS PICKED",
        "EN ROUTE TO DESTINATION",
        "DELIEVERED",
        "CANCELLED"
      ),
      allowNull: false,
    },
    // tripStart:{
    //   type: Sequelize.DATE,
    //   allowNull: true,
    //   defaultValue: null,
    // },
    // tripEnd:{
    //   type: Sequelize.DATE,
    //   allowNull: true,
    //   defaultValue: null,
    // },
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
    modelName: "booking",
  }
);

payment.belongsTo(booking, {
  foreignKey: "booking_id",
  sourceKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

booking.hasMany(payment, {
  foreignKey: "booking_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// await payment.sync({alter:true});

module.exports = booking;
