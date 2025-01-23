"use strict";

const { DECIMAL } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = "lodging_schema"; // Explicitly set to lodging_schema for development
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Spots",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        ownerId: {
          type: Sequelize.INTEGER,
          allowNull: false, // Add this for consistency
        },
        address: {
          type: Sequelize.STRING(255), // Increased length from 30 to 255
          allowNull: false,
        },
        city: {
          type: Sequelize.STRING(100), // Increased length from 30 to 100
          allowNull: false,
        },
        state: {
          type: Sequelize.STRING(100), // Increased length from 30 to 100
          allowNull: false,
        },
        country: {
          type: Sequelize.STRING(100), // Increased length from 30 to 100
          allowNull: false,
        },
        lat: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        lng: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING(50), // Name length set to 50
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT, // Use TEXT for longer descriptions
          allowNull: false,
        },
        price: {
          type: Sequelize.DECIMAL(10, 2), // Correct decimal precision for prices
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.dropTable(options);
  },
};
