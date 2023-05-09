// const SpotifyWebApi = require('spotify-web-api-node');
// const dotenv = require('dotenv');
const router = require('express').Router();

const { User } = require('../models');
const spotifyApi = require('../config/spotify-config');
const { spotifyAuth } = require('../utils/spotify-auth');

// credentials are optional
// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.SPOT_CLIENT_ID,
//   clientSecret: process.env.SPOT_CLIENT_SECRET,
//   redirectUri: 'http://localhost:3001/spotify/callback',
// });

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

router.get('/callback', spotifyAuth, async (req, res) => {
  const currentUser = await spotifyApi.getMe();

  const userExists = await User.findAll({
    where: {
      spotify_id: currentUser.body.id,
    },
  });

  if (!userExists[0]) {
    console.log('User does not exist.');

    const newUser = await User.create({
      spotify_id: currentUser.body.id,
      display_name: currentUser.body.display_name,
      email: currentUser.body.email,
    });

    console.log(newUser);
  } else {
    console.log('User exists.');
  }

  res.status(200).json(currentUser);
  //('/dashboard');
});

// methods for grabbing spotify info
// still need to call these somewhere

// get current logged in users info
const getMe = async () => {
  try {
    const {
      body: { userId },
    } = await spotifyApi.getMe();
    console.log('Some information about the authenticated user', userId);
    return userId; // return the user id for later reference
  } catch (err) {
    console.log('Something went wrong!', err);
    throw err; // re-throw the error to the calling code
  }
};

// Get a user's playlists
const getUserPlaylists = async (userId) => {
  //usually takes in string parameter to search by user but i put id to see more specific search might not work
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
