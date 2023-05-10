const router = require('express').Router();
const { Playlist, Song } = require('../../models');
const { spotifyAuth } = require('../../utils/spotify-auth');
const spotifyApi = require('../../config/spotify-config');

// grab user playlists and save to database models
router.post('/', async (req, res) => {
  //console.log('this route is running');
  try {
    // console.log(req.session.userId);
    // console.log(req.session.spotAuthTok);
    // console.log(spotifyApi._credentials.accessToken);

    // get user playlists from spotify
    const playlistData = await spotifyApi.getUserPlaylists(req.session.userId);
    // console.log(playlistData.body.items.length);

    // Map over the playlist data
    const playlists = await Promise.all(
      playlistData.body.items.map(async (playlist) => {
        // Check if the playlist already exists in the database
        const existingPlaylist = await Playlist.findOne({
          where: {
            spotify_id: playlist.id,
          },
        });

        // If the playlist doesn't exist, create a new one and populate its songs
        if (!existingPlaylist) {
          const newPlaylist = await Playlist.create({
            spotify_id: playlist.id,
            playlist_img_url: playlist.images[0]?.url,
            title: playlist.name,
            description: playlist.description,
            user_id: req.session.userId,
          });

          // Get the tracks for the playlist from Spotify
          const playlistTracks = await spotifyApi.getPlaylistTracks(playlist.id);

          // Map over the tracks and create song objects with necessary fields
          const tracks = playlistTracks.body.items.map((track) => ({
            spotify_id: track.track.id,
            title: track.track.name,
            artist: track.track.artists[0].name,
            album: track.track.album?.name,
            year_released: track.track.album?.release_date?.split('-')[0],
            // Include any other relevant fields for the Song model
          }));

          // Bulk create the songs and associate them with the playlist
          await Song.bulkCreate(tracks);
          await newPlaylist.setSongs(tracks);

          // Return the newly created playlist
          return newPlaylist;
        }

        // If the playlist already exists, return it without making any changes
        return existingPlaylist;
      })
    );

    // Send the populated playlists as a JSON response
    res.status(200).json(playlists);
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).json(err);
  }
});

// create new playlist
// router.post('/', spotifyAuth, async (req, res) => {
//   try {
//     const newPlaylist = await Playlist.create({
//       ...req.body,
//       user_id: req.session.user_id,
//     });
//     res.status(200).json(newPlaylist);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

// add to an existing playlist
router.post('/:playlistId/add-song', spotifyAuth, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songId } = req.body;

    const playlist = await Playlist.findOne({
      where: {
        id: playlistId,
        // user_id: req.session.user_id,
      },
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    await PlaylistSong.create({
      playlist_id: playlistId,
      song_id: songId,
    });

    res.status(200).json({ message: 'Song added to playlist successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', spotifyAuth, async (req, res) => {
  try {
    const playlistData = await Playlist.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!playlistData) {
      res.status(404).json({ message: 'No playlist found with this id!' });
      return;
    }

    res.status(200).json(playlistData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
