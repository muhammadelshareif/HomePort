"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      "Spots",
      "description",
      {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      "Spots",
      "description",
      {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      options
    );
  },
};
