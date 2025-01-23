const config = require("./index");

module.exports = {
  development: {
    username: "muhammad",
    password: null,
    database: "mod5_project_db",
    host: "127.0.0.1",
    dialect: "postgres",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
    schema: "lodging_schema",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    seederStorage: "sequelize",
    schema: "lodging_schema",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      // Add schema to search path
      searchPath: ["lodging_schema"],
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  },
};
