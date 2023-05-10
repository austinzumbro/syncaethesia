const router = require('express').Router();
const { Playlist, Song } = require('../../models');
const { spotifyAuth } = require('../../utils/spotify-auth');
const spotifyApi = require('../../config/spotify-config');

// grab user playlists and save to database models
router.post('/', async (req, res) => {
  console.log('this route is running');

  try {
    console.log(req.session.userId);
    console.log(req.session.spotAuthTok);
    console.log(spotifyApi._credentials.accessToken);
    const playlistData = await spotifyApi.getUserPlaylists(req.session.userId);
    console.log(playlistData.body.items.length);

    // for (let i = 0; i < playlistData.body.items.length; i++) {
    //   console.log(playlistData.body.items[i]);
    // }

    // console.log(playlistData.body.items);
    // const playlists = [];
    // playlistData.body.items.forEach((playlist) => {
    //   let newPlaylist = {
    //     spotify_id: playlist.id,
    //     playlist_img_url: playlist.images[0].url,
    //     title: playlist.name,
    //     description: playlist.description,
    //     user_id: req.body.userId,
    //   }
    // } playlists.push(playlist));

    const playlists = playlistData.body.items.map((playlist) => {
      // console.log(playlist.images[0]);
      // console.log('meow');
      // return { name: 'meow' };
      return {
        spotify_id: playlist.id,
        playlist_img_url: playlist.images[0]?.url,
        title: playlist.name,
        description: playlist.description,
        user_id: req.session.userId,
      };
    });
playlists.forEach(async(playlist) => {
    const playlistExist = await Playlist.findOne({
      where: {
        spotify_id: playlist.spotify_id,
      }
    });
    if(!playlistExist){
      const newPlaylist = await Playlist.create({
        playlist,
      })
    }
})
    // const newPlaylists = await Playlist.bulkCreate(playlists);
    res.status(200).json(newPlaylists);
    // need to render homepage if successful
  } catch (err) {
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
