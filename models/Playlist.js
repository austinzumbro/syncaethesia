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
    // Associated Post id
    song_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'song',
        key: 'id',
      },
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
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'playlist',
  }
);

module.exports = Playlist;
