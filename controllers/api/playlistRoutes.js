const router = require('express').Router();
const { Playlist, Song, PlaylistSong } = require('../../models');
const { spotifyAuth } = require('../../utils/spotify-auth');
const spotifyApi = require('../../config/spotify-config');

// grab user playlists and save to database models
router.post('/', async (req, res) => {
  try {
    console.log('THE ROUTE IS RUNNING');
    // Get user playlists from spotify
    const playlistData = await spotifyApi.getUserPlaylists(
      req.session.spotifyId
    );

    // Map over the playlist data
    // const playlists = await Promise.all(
    // const playlists = playlistData.body.items.map(async (playlist) => {

    const playlistDataShortened = [
      playlistData.body.items[0],
      playlistData.body.items[1],
      playlistData.body.items[2],
    ];

    playlistDataShortened.forEach(async (playlist) => {
      let playlistId;
      // Check if the playlist already exists in the database
      const existingPlaylist = await Playlist.findOne({
        where: {
          spotify_id: playlist.id,
        },
      });
      // console.log('THIS IS A LOOP OF THE MAP FUNCTION');
      // console.log(existingPlaylist);

      // If the playlist doesn't exist, create a new one and populate its songs
      if (!existingPlaylist) {
        const newPlaylist = await Playlist.create({
          spotify_id: playlist.id,
          playlist_img_url: playlist.images[0]?.url,
          title: playlist.name,
          description: playlist.description,
          user_id: req.session.userId,
        });

        playlistId = newPlaylist.id;
      } else {
        playlistId = existingPlaylist.id;
      }

      // Get the tracks for the playlist from Spotify
      const playlistTracks = await spotifyApi.getPlaylistTracks(playlist.id);
      // console.log(playlistTracks);

      // Map over the tracks and create song objects with necessary fields
      const tracks = playlistTracks.body.items.map((track) => ({
        spotify_id: track.track.id,
        title: track.track.name,
        artist: track.track.artists[0].name,
        album: track.track.album?.name,
        year_released: track.track.album?.release_date?.split('-')[0],
        // Include any other relevant fields for the Song model
      }));

      // console.log(playList_savedTracks);

      tracks.forEach(async (track) => {
        try {
          let trackId;

          const trackExists = await Song.findOne({
            where: {
              spotify_id: track.spotify_id,
            },
          });

          if (!trackExists) {
            // console.log('TRACK DOES NOT EXIST');
            const newSong = await Song.create({
              spotify_id: track.spotify_id,
              title: track.title,
              artist: track.artist,
              album: track.album,
              // year_released: track.year_released,
            });
            trackId = newSong.id;
            console.log(newSong);
          } else {
            trackId = trackExists.id;
          }

          try {
            console.log(
              '\n *********** TRACK ID AND PLAYLIST ID ************** \n'
            );
            console.log(trackId);
            console.log(playlistId);
            console.log(
              '\n *********** TRACK ID AND PLAYLIST ID ************** \n'
            );

            const relationshipExists = await PlaylistSong.findOne({
              where: {
                song_id: trackId,
                playlist_id: playlistId,
              },
            });

            if (!relationshipExists) {
              const newPlaylistSong = await PlaylistSong.create({
                song_id: trackId,
                playlist_id: playlistId,
              });

              console.log(newPlaylistSong);
            }
          } catch (err) {
            console.error(err);
          }
        } catch (err) {
          console.error(err);
        }
      });
    });
    res.status(200).json({ message: 'Playlists and songs imported.' });
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
