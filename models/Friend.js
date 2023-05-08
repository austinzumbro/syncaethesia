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

    a_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        as: 'a',
        key: 'id',
      },
    },

    b_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        as: 'b',
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
