const User = require('./User');
const Song = require('./Song');
const Playlist = require('./Playlist');
const Friend = require('./Friend');
const UserPlaylist = require('./UserPlaylist');
const PlaylistSong = require('./PlaylistSong');

User.hasMany(Playlist, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Playlist.belongsTo(User, { foreignKey: 'user_id' });

Playlist.belongsToMany(Song, { through: PlaylistSong, foreignKey: 'playlist_spotify_id' });
Song.belongsToMany(Playlist, { through: PlaylistSong, foreignKey: 'song_spotify_id' });

User.belongsToMany(User, {
  as: 'a',
  foreignKey: 'user_id',
  through: Friend,
});
User.belongsToMany(User, {
  as: 'b',
  foreignKey: 'friend_id',
  through: Friend,
});

module.exports = { User, Song, Playlist, Friend, UserPlaylist, PlaylistSong };
