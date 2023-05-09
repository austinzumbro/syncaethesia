const router = require('express').Router();
const { Song } = require('../../models');
const spotifyApi = require('../../config/spotify-config');
/* const withAuth = require('../../utils/auth'); */

router.post('/search', async (req, res) => {
  const songList = await spotifyApi.searchTracks(`track:${req.body.track}`);

  console.log('I got ' + songList.body.tracks.total + ' results!');

  // Go through the first page of results
  const firstPage = songList.body.tracks.items;
  console.log('The tracks in the first page are (popularity in parentheses):');

  /*
   * 0: All of Me (97)
   * 1: My Love (91)
   * 2: I Love This Life (78)
   * ...
   */

  let returnArray = [];

  firstPage.forEach(function (track, index) {
    returnArray.push(track.name);
    //   index + ': ' + track.name + ' (' + track.popularity + ')'
    // );
  });
  console.log(returnArray);

  res.status(200).json(returnArray);

  // try {
  //   const newSong = await Song.create({
  //     ...req.body,
  //     user_id: req.session.user_id,
  //   });
  //   res.status(200).json(newSong);
  // } catch (err) {
  //   res.status(400).json(err);
  // }
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
