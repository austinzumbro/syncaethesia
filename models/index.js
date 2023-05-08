const User = require('./User');
const Song = require('./Song');
const Playlist = require('./Playlist');
const Friend = require('./Friend');

User.hasMany(Playlist, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Playlist.belongsTo(User, {
  foreignKey: 'user_id',
});

Playlist.hasMany(Song, {
  foreignKey: 'song_id',
});

Song.belongsTo(Playlist, {
  foreignKey: 'song_id',
});

User.belongsToMany(User, { as: 'a', foreignKey: 'a_id', through: Friend });
User.belongsToMany(User, { as: 'b', foreignKey: 'b_id', through: Friend });

module.exports = { User, Song, Playlist, Friend };
