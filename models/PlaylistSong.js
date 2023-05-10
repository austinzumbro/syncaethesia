const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

class PlaylistSong extends Model {}

PlaylistSong.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    song_spotify_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'song',
        key: 'spotify_id',
      },
    },
    playlist_spotify_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'playlist',
        key: 'spotify_id',
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'playlist_song',
  }
);

module.exports = PlaylistSong;
