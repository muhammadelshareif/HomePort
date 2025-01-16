"use strict";
const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });
      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
        onDelete: "CASCADE",
      });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Street address is required" },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "City is required" },
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "State is required" },
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Country is required" },
        },
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isDecimal: true,
          min: {
            args: [-90],
            msg: "Latitude must be greater than or equal to -90",
          },
          max: {
            args: [90],
            msg: "Latitude must be less than or equal to 90",
          },
        },
      },

      lng: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isDecimal: true,
          min: {
            args: [-180],
            msg: "Longitude must be greater than or equal to -180",
          },
          max: {
            args: [180],
            msg: "Longitude must be less than or equal to 180",
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Name is required" },
          len: {
            args: [1, 50],
            msg: "Name must be less than 50 characters",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Description is required" },
        },
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "Price must be a positive number",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
