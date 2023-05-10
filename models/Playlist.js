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
    spotify_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    playlist_img_url: {
      type: DataTypes.STRING,
      allowNull: true,
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
      allowNull: true,
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
