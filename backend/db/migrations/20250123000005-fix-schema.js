"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE public."Spots" 
      ALTER COLUMN address TYPE VARCHAR(255),
      ALTER COLUMN city TYPE VARCHAR(100),
      ALTER COLUMN state TYPE VARCHAR(100),
      ALTER COLUMN country TYPE VARCHAR(100),
      ALTER COLUMN description TYPE TEXT;
    `);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE public."Spots"
      ALTER COLUMN address TYPE VARCHAR(30),
      ALTER COLUMN city TYPE VARCHAR(30),
      ALTER COLUMN state TYPE VARCHAR(30),
      ALTER COLUMN country TYPE VARCHAR(30),
      ALTER COLUMN description TYPE VARCHAR(30);
    `);
  },
};
