"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Mindmap, {
        foreignKey: "user_id",
        as: "mindmaps",
      })
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING(100),
      password: DataTypes.STRING(150),
      picture: DataTypes.STRING,
      provider: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      expired_at: DataTypes.DATE(),
      id_reset: DataTypes.STRING,
      desc: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  )
  return User
}
