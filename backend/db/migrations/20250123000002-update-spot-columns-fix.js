"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      "Spots",
      "address",
      {
        type: Sequelize.STRING(255),
      },
      options
    );
    await queryInterface.changeColumn(
      "Spots",
      "city",
      {
        type: Sequelize.STRING(100),
      },
      options
    );
    await queryInterface.changeColumn(
      "Spots",
      "state",
      {
        type: Sequelize.STRING(100),
      },
      options
    );
    await queryInterface.changeColumn(
      "Spots",
      "country",
      {
        type: Sequelize.STRING(100),
      },
      options
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      "Spots",
      "address",
      {
        type: Sequelize.STRING(30),
      },
      options
    );
    await queryInterface.changeColumn(
      "Spots",
      "city",
      {
        type: Sequelize.STRING(30),
      },
      options
    );
    await queryInterface.changeColumn(
      "Spots",
      "state",
      {
        type: Sequelize.STRING(30),
      },
      options
    );
    await queryInterface.changeColumn(
      "Spots",
      "country",
      {
        type: Sequelize.STRING(30),
      },
      options
    );
  },
};
