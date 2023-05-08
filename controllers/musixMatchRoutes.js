const router = require('express').Router();
const dotenv = require('dotenv');

router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.MUSIXMATCH_KEY;
    const trackName = 'Revive';
    const artistName = 'LIONE';

    const apiUrl = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=json&q_track=${trackName}&q_artist=${artistName}&apikey=${apiKey}`;

    const response = await fetch(apiUrl);

    console.log(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
