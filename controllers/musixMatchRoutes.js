const router = require('express').Router();
const dotenv = require('dotenv');
// const fetch = require('node-fetch');

const Musixmatch = require('musixmatch');
const init = {
  apikey: process.env.MUSIXMATCH_KEY,
  baseURL: 'http://api.musixmatch.com/ws/1.1/',
  corsURL: '',
  format: 'json',
};
const msx = Musixmatch(init);

router.get('/', async (req, res) => {
  try {
    const response = await msx.chartArtists({
      country: 'us',
      page: 1,
      page_size: 3,
    });
    console.log(response.artist_list);
    console.log(response);
    res.render('homepage');
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
