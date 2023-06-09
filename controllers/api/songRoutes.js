const router = require('express').Router();
const { Song } = require('../../models');
const spotifyApi = require('../../config/spotify-config');
const {
  spotifyAuth,
  sessionAuth,
  checkSpotAuth,
} = require('../../utils/spotify-auth');
/* const withAuth = require('../../utils/auth'); */

// Save new song to the database

/* Post Body needs to include:
    {
      "spotify_id",z
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

function delay(retryCount) {
  console.log('Delay is being called.');
  return new Promise((resolve) => setTimeout(resolve, 10 ** retryCount));
}

const tryBackoff = async (apiCall, retryCount = 3, lastError = null) => {
  if (retryCount > 5) throw new Error(lastError);
  try {
    console.log('\n ----- TRYING THE API CALL ----- \n');
    return await apiCall;
  } catch (err) {
    console.log("\n @@@@@@@ It didn't work, so now we wait. @@@@@@ \n");
    await delay(retryCount);
    return tryBackoff(apiCall, retryCount + 1, err);
  }
};

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

router.post(
  '/search',
  //sessionAuth,
  checkSpotAuth,
  async (req, res) => {
    const songList = await spotifyApi.searchTracks(
      `track:${req.body.track} artist:${req.body.artist}`
    );

    // Go through the first page of results
    const firstPage = songList.body.tracks.items;

    let returnArray = [];

    firstPage.forEach(function (track, index) {
      returnArray.push(track);
    });
    console.log(returnArray);

    res.status(200).json(JSON.stringify(returnArray));
  }
);

router.post('/import-features', async (req, res) => {
  try {
    const allSongs = await Song.findAll({
      attributes: ['spotify_id'],
      where: {
        tempo: null,
      },
    });
    const allSpotifyIds = allSongs.map((song) => song.spotify_id);

    async function getAudioFeaturesLoop(arrOfIds) {
      let i = 0;
      let counter = 100;
      while (i < arrOfIds.length - 1) {
        let searchArray = arrOfIds.slice(i, counter);

        const songAnalysis = await spotifyApi.getAudioFeaturesForTracks(
          searchArray
        );
        // console.log(songAnalysis)
        const audioFeaturesArray = songAnalysis.body.audio_features;

        audioFeaturesArray.forEach(async (track) => {
          const updateSong = await Song.update(
            {
              tempo: track.tempo,
              danceability: track.danceability,
              valence: track.valence,
              speechiness: track.speechiness,
            },
            {
              where: {
                spotify_id: track.id,
              },
            }
          );
          console.log(updateSong);
        });

        i = counter;
        counter += 100;
        if (i > arrOfIds.length) {
          i = arrOfIds.length;
        }
      }
    }

    await getAudioFeaturesLoop(allSpotifyIds);

    // const getSongAnalysis = (songId) => {};

    // const songAnalysis = await spotifyApi.getAudioFeaturesForTrack(currentId);
    // console.log(songAnalysis);
    // const updateSong = Song.update(
    //   {
    //     tempo: songAnalysis.body.tempo,
    //     danceability: songAnalysis.body.danceability,
    //     valence: songAnalysis.body.valence,
    //     speechiness: songAnalysis.body.speechiness,
    //   },
    //   {
    //     where: {
    //       spotify_id: currentId,
    //     },
    //   }
    // );
    res.status(200).json({ message: 'Audio feature import successful.' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
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
