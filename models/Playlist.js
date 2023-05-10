const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

class Playlist extends Model {}

Playlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // Store the current datetime at moment of creation
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Associated User id of the user making the comment
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    // store title of playlist
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // store description of playlist
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'playlist',
  }
);

module.exports = Playlist;
