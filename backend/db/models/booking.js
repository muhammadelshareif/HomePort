'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete:'CASCADE',
      });
    }
  }
  
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'Spot',
        key: 'id'
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'CASCADE',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        notInPast(value) {
          if (new Date(value) < new Date()) {
            throw new Error('Start date cannot be in the past');
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStartDate(value) {
          if (new Date(value) <= new Date(this.startDate)) {
            throw new Error('End date must be after start date');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  
  return Booking;
};