"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class blacklistToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  blacklistToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: DataTypes.STRING,
      expired: DataTypes.DATE(),
    },
    {
      sequelize,
      modelName: "blacklistToken",
      tableName: "blacklist_tokens",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  )
  return blacklistToken
}
