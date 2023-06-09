const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
class Friend extends Model {}

Friend.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        as: 'user',
        key: 'id',
      },
    },

    friend_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        as: 'friend',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'friend',
  }
);

module.exports = Friend;
