"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class keyToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      keyToken.belongsTo(models.User, {
        foreignKey: "user_id",
      })
    }
  }
  keyToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.INTEGER,
      public_key: DataTypes.STRING,
      private_key: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "keyToken",
      tableName: "key_tokens",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  )
  return keyToken
}
