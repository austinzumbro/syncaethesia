const router = require('express').Router();
const { Song } = require('../../models');
/* const withAuth = require('../../utils/auth'); */

router.post('/', async (req, res) => {
  try {
    const newSong = await Song.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newSong);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const songData = await Song.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!songData) {
      res.status(404).json({ message: 'No song found with this id!' });
      return;
    }

    res.status(200).json(songData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
