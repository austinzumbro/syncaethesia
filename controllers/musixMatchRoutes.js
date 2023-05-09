const router = require('express').Router();
const dotenv = require('dotenv');
const Musixmatch = require('musixmatch');
const init = {
  apikey: process.env.MUSIXMATCH_KEY,
  baseURL: 'http://api.musixmatch.com/ws/1.1/',
  corsURL: '',
  format: 'json',
};
const msx = Musixmatch(init);

router.post('/', async (req, res) => {
  console.log(req.body);
  try {
    const response = await msx.matcherLyrics({
      q_track: req.body.q_track,
      q_artist: req.body.q_artist,
    });
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
