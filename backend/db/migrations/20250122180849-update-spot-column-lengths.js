"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Spots", "address", {
      type: Sequelize.STRING(255),
    });
    await queryInterface.changeColumn("Spots", "city", {
      type: Sequelize.STRING(100),
    });
    await queryInterface.changeColumn("Spots", "state", {
      type: Sequelize.STRING(100),
    });
    await queryInterface.changeColumn("Spots", "country", {
      type: Sequelize.STRING(100),
    });
    await queryInterface.changeColumn("Spots", "name", {
      type: Sequelize.STRING(100),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Spots", "address", {
      type: Sequelize.STRING(30),
    });
    await queryInterface.changeColumn("Spots", "city", {
      type: Sequelize.STRING(30),
    });
    await queryInterface.changeColumn("Spots", "state", {
      type: Sequelize.STRING(30),
    });
    await queryInterface.changeColumn("Spots", "country", {
      type: Sequelize.STRING(30),
    });
    await queryInterface.changeColumn("Spots", "name", {
      type: Sequelize.STRING(30),
    });
  },
};
