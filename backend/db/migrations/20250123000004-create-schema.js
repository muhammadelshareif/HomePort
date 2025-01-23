// migrations/20250123000004-create-schema.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createSchema("lodging_schema");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropSchema("lodging_schema");
  },
};
