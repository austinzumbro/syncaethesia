const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

class Song extends Model {}

Song.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    spotify_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Post title.
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Post content
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    album: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year_released: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tempo: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    danceability: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    valence: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    speechiness: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    lyrics: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'song',
  }
);

module.exports = Song;
