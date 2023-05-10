const router = require('express').Router();
const { Playlist, Song } = require('../../models');
const { spotifyAuth } = require('../../utils/spotify-auth');
const spotifyApi = require('../../config/spotify-config');

router.get('/', spotifyAuth, async (req, res) => {
  try {
    const playlistData = await spotifyApi.getUserPlaylists(req.session.user_id);
    const playlists = playlistsData.body.items.map((playlist) => {
      return {
        date_created: new Date(),
        song_id: playlist.id,
        user_id: req.session.user_id,
      };
    });
    const newPlaylists = await Playlist.bulkCreate(playlists);
    res.status(200).json(newPlaylists);
  }
  catch (err){
    res.status(500).json(err);
  }
});

router.post('/', spotifyAuth, async (req, res) => {
  try {
    const newPlaylist = await Playlist.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPlaylist);
  } catch (err) {
    res.status(400).json(err);
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
