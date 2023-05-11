const sequelize = require('../config/connection');
const { User, Playlist, Song, PlaylistSong } = require('../models');
const userData = require('./user-seeds.json');
const playlistData = require('./playlist-seeds.json');
const songData = require('./song-seeds.json');
const playlistSongData = require('./playlistsong-seeds.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Playlist.bulkCreate(playlistData, {
    individualHooks: true,
    returning: true,
  });

  await Song.bulkCreate(songData, {
    individualHooks: true,
    returning: true,
  });

  await PlaylistSong.bulkCreate(playlistSongData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
