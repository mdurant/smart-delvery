'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Route.init({
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    averageSpeed: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Route',
  });
  return Route;
};