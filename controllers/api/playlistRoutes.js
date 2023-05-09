const router = require('express').Router();
const { Playlist, Song } = require('../../models');
const { spotifyAuth } = require('../../utils/spotify-auth');

router.get('/', spotifyAuth, async (req, res) => {
  try {
    const playlistData = await Playlist.findAll({
      where: {
        user_id: req.session.user_id
      },
      include: [
        {
          model: Song,
          attributes: ['id', 'title', 'artist', 'album', 'genre']
        }
      ]
    });
    const playlists = playlistData.map((playlist) => playlist.get({ plain: true }));
    res.status(200).json(playlists);
  } catch (err) {
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
