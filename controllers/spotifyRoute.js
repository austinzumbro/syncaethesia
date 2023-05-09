const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');
const router = require('express').Router();

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOT_CLIENT_ID,
  clientSecret: process.env.SPOT_CLIENT_SECRET,
  redirectUri: 'http://localhost:3001/spotify/callback',
});

//creating authorize url
const scopes = [
  'user-read-private',
  'user-read-email',
  'user-modify-playback-state',
  'user-read-playback-position',
  'user-library-read',
  'streaming',
  'user-read-playback-state',
  'user-read-recently-played',
  'playlist-read-private',
];
//state = 'stupid';

const authorizeURL = process.env.AUTHORIZE_URL;

router.get('/', async (req, res) => {
  try {
    res.render('homepage', { authorizeURL });
    console.log(authorizeURL);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;
  const data = await spotifyApi.authorizationCodeGrant(code);

  console.log('The token expires in ' + data.body['expires_in']);
  console.log('The access token is ' + data.body['access_token']);
  console.log('The refresh token is ' + data.body['refresh_token']);

  spotifyApi.setAccessToken(data.body['access_token']);
  spotifyApi.setRefreshToken(data.body['refresh_token']);

  res.redirect('/dashboard');
});

module.exports = router;
