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
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    danceability: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    valence: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    speechiness: {
      type: DataTypes.DECIMAL,
      allowNull: false,
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
