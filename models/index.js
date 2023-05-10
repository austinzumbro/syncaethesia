const User = require('./User');
const Song = require('./Song');
const Playlist = require('./Playlist');
const Friend = require('./Friend');
const UserPlaylist = require('./UserPlaylist');
const PlaylistSong = require('./PlaylistSong');

User.belongsToMany(Playlist, { through: UserPlaylist });
Playlist.belongsToMany(User, { through: UserPlaylist });

Playlist.belongsToMany(Song, { through: PlaylistSong });
Song.belongsToMany(Playlist, { through: PlaylistSong });

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
