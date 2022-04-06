"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Squser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Squser.hasMany(models.Balance, {
        foreignKey: "userId",
        as: "balances",
      });
      Squser.hasMany(models.Transaction, {
        foreignKey: "userId",
        as: "transactions",
      });
    }
  }
  Squser.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Squser",
    }
  );
  return Squser;
};
