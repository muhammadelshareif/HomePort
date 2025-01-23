"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert into Spots table
    await queryInterface.bulkInsert(
      { tableName: "Spots", schema: "lodging_schema" }, // Explicitly set the schema
      [
        {
          ownerId: 1,
          address: "123 Seaside Ave",
          city: "Malibu",
          state: "California",
          country: "USA",
          lat: null,
          lng: null,
          name: "Beachfront Villa",
          description:
            "Luxurious villa with direct beach access and panoramic ocean views",
          price: 899,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 1,
          address: "456 Mountain View",
          city: "Aspen",
          state: "Colorado",
          country: "USA",
          lat: null,
          lng: null,
          name: "Mountain Chalet",
          description:
            "Cozy ski-in/ski-out chalet with hot tub and stunning mountain views",
          price: 599,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 1,
          address: "789 Desert Road",
          city: "Scottsdale",
          state: "Arizona",
          country: "USA",
          lat: null,
          lng: null,
          name: "Desert Oasis",
          description:
            "Modern desert retreat with infinity pool and mountain views",
          price: 450,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    );

    // Insert into SpotImages table
    await queryInterface.bulkInsert(
      { tableName: "SpotImages", schema: "lodging_schema" }, // Explicitly set the schema
      [
        {
          spotId: 1,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-52746241/original/6058e94d-2770-47cd-91a8-3d90e7027c44.jpeg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-50117645/original/ea0caad4-08d5-44ca-8891-419ce3b62460.jpeg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 3,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-788819262270983624/original/f39797f0-6923-46e9-acc8-3d20ef5f3260.jpeg",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    );

    console.log("Seeding Spots and SpotImages successful!");
  },

  async down(queryInterface, Sequelize) {
    // Delete SpotImages first to avoid foreign key constraint issues
    await queryInterface.bulkDelete(
      { tableName: "SpotImages", schema: "lodging_schema" },
      null,
      {}
    );

    // Delete Spots
    await queryInterface.bulkDelete(
      { tableName: "Spots", schema: "lodging_schema" },
      null,
      {}
    );

    console.log("Seeding rollback for Spots and SpotImages completed!");
  },
};
