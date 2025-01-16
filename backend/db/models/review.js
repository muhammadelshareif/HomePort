"use strict";

const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.hasMany(models.ReviewImage, {
        foreignKey: "reviewId",
        onDelete: "CASCADE",
      });

      Review.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      Review.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });
    }
  }
  Review.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Spot",
          key: "id",
        },
        validate: {
          notNull: { msg: "Spot ID is required" },
          notEmpty: { msg: "Spot ID is required" },
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
        validate: {
          notNull: { msg: "User ID is required" },
          notEmpty: { msg: "User ID is required" },
        },
        onDelete: "CASCADE",
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Review text is required" },
        },
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "Stars must be an integer" },
          min: {
            args: [1],
            msg: "Stars must be at least 1",
          },
          max: {
            args: [5],
            msg: "Stars must be at most 5",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
