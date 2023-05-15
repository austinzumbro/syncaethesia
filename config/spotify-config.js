const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOT_CLIENT_ID,
  clientSecret: process.env.SPOT_CLIENT_SECRET,
  redirectUri: process.env.CALLBACK_URL_HEROKU
    ? process.env.CALLBACK_URL_HEROKU
    : process.env.CALLBACK_URL,
});

module.exports = spotifyApi;
