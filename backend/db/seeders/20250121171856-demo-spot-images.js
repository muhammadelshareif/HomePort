"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "SpotImages",
      [
        {
          spotId: 1, // Match the ID from your earlier spot seeder
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-855965199489964144/original/2dd36221-0778-4b10-a16d-1d1c9ab83ba8.jpeg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-53364737/original/db5404fc-9cbe-4c41-a7d0-9dec5de5adc4.jpeg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("SpotImages", null, {});
  },
};
