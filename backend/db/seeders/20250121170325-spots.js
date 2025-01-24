"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      { tableName: "Spots", schema: "lodging_schema" },
      [
        {
          ownerId: 1, // Ensure this matches an existing user ID
          name: "Cozy Mountain Cabin",
          address: "123 Pine Road",
          city: "Aspen",
          state: "Colorado",
          country: "United States",
          lat: 39.1911,
          lng: -106.8175,
          description: "A charming cabin nestled in the mountains",
          price: 150,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 1,
          name: "Beach House Retreat",
          address: "456 Ocean View",
          city: "Santa Cruz",
          state: "California",
          country: "United States",
          lat: 36.9741,
          lng: -122.0307,
          description: "Relaxing beach house with ocean views",
          price: 250,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      { tableName: "Spots", schema: "lodging_schema" },
      null,
      {}
    );
  },
};
