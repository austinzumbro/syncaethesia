const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOT_CLIENT_ID,
  clientSecret: process.env.SPOT_CLIENT_SECRET,
  redirectUri: 'https://melore.herokuapp.com/spotify/callback',
});

module.exports = spotifyApi;
