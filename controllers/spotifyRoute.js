const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');
const router = require('express').Router();

const { User } = require('../models');

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

  
  // grab spotify info
  try {
    // grab spotify info
    const { body: { id, display_name, email } } = await getMe();

    // create new user in database
    const newUser = await User.create({ 
      id: id,
      display_name: display_name,
      email: email
    });

    console.log('New user created:', newUser);

    res.redirect('/dashboard');
  } catch (err) {
    console.log('Something went wrong!', err);
    res.status(500).send('Error creating new user');
  }
});

// methods for grabbing spotify info
// still need to call these somewhere

// get current logged in users info
const getMe = async () => {
  try {
    const { body: { id, display_name, email } } = await spotifyApi.getMe();
    console.log('Some information about the authenticated user', id);
    return { id, display_name, email }; // return the user info for later reference
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err; // re-throw the error to the calling code
  }
}

// Get a user's playlists
const getUserPlaylists = async (useridId) => { //usually takes in string parameter to search by user but i put id to see more specific search might not work
  try {
    const { body } = await spotifyApi.getUserPlaylists(id);
    console.log('Retrieved playlists', body);
    return body;
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err;
  }
};







module.exports = router;
