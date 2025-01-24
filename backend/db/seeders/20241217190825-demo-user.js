"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      { tableName: "Users", schema: "lodging_schema" },
      [
        {
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
          firstName: "Demo",
          lastName: "Littion",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "user1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
          firstName: "Bobby",
          lastName: "Johnson",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "Alex",
          lastName: "Cross",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "pb@user.io",
          username: "pbateman",
          hashedPassword: bcrypt.hashSync("password"),
          firstName: "Patrick",
          lastName: "Bateman",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "stetson@user.io",
          username: "skliment",
          hashedPassword: bcrypt.hashSync("password"),
          firstName: "Stetson",
          lastName: "Kliment",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      { tableName: "Users", schema: "lodging_schema" },
      {
        username: {
          [Sequelize.Op.in]: [
            "Demo-lition",
            "FakeUser1",
            "FakeUser2",
            "DemoUser",
            "pbateman",
            "skliment",
          ],
        },
      },
      {}
    );
  },
};
