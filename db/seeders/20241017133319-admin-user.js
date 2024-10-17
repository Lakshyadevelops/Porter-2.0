const bcrypt = require("bcrypt");

module.exports = {
  up: (queryInterface, Sequelize) => {
    const hashPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
    return queryInterface.bulkInsert("user", [
      {
        name: "Admin Agarwal",
        email: process.env.ADMIN_EMAIL,
        phone: "8812345678",
        role:"ADMIN",
        password:hashPassword,
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("user", {role:"ADMIN"}, {});
  },
};
