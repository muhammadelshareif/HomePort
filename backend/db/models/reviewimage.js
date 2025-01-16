"use strict";

const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      ReviewImage.belongsTo(models.Review, {
        foreignKey: "reviewId",
        onDelete: "CASCADE",
      });
    }
  }
  ReviewImage.init(
    {
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Review",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: { msg: "URL must be a valid URL" },
        },
      },
    },
    {
      sequelize,
      modelName: "ReviewImage",
    }
  );
  return ReviewImage;
};
