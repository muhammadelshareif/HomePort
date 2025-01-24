"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      { tableName: "SpotImages", schema: "lodging_schema" },
      [
        {
          spotId: 1,
          url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://images.pexels.com/photos/277667/pexels-photo-277667.jpeg",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg",
          preview: true,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      { tableName: "SpotImages", schema: "lodging_schema" },
      null,
      {}
    );
  },
};
