"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = "lodging_schema"; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      { tableName: "Spots", schema: options.schema },
      [
        {
          ownerId: 1,
          address: "123 Seaside Ave",
          city: "Malibu",
          state: "California",
          country: "USA",
          lat: 34.0259,
          lng: -118.7798,
          name: "Beachfront Villa",
          description: "Luxurious villa with direct beach access.",
          price: 899.99,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 1,
          address: "789 Desert Road",
          city: "Scottsdale",
          state: "Arizona",
          country: "USA",
          lat: 33.4942,
          lng: -111.9261,
          name: "Desert Oasis",
          description: "Modern desert retreat with stunning views.",
          price: 450.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      { tableName: "Spots", schema: options.schema },
      null,
      {}
    );
  },
};
