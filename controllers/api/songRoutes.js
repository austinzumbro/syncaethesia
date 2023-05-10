const router = require('express').Router();
const { Song } = require('../../models');
const spotifyApi = require('../../config/spotify-config');
/* const withAuth = require('../../utils/auth'); */

// Save new song to the database

/* Post Body needs to include:
    {
      "spotify_id",
      "title",
      "artist",
      "album",
      "year_released",
      "tempo",
      "danceability",
      "valence",
      "speechiness",
      "lyrics",
    }
*/
router.post('/', async (req, res) => {
  try {
    const newSong = await Song.create({
      ...req.body,
    });
    res.status(200).json(newSong);
  } catch (err) {
    res.status.apply(500).json(err);
  }
});

router.post('/search', async (req, res) => {
  const songList = await spotifyApi.searchTracks(`track:${req.body.track}`);

  console.log('I got ' + songList.body.tracks.total + ' results!');

  // Go through the first page of results
  const firstPage = songList.body.tracks.items;

  console.log(firstPage);

  let returnArray = [];

  firstPage.forEach(function (track, index) {
    returnArray.push(track);
  });
  console.log(returnArray);

  res.status(200).json(returnArray);
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
