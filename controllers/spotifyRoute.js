// const SpotifyWebApi = require('spotify-web-api-node');
// const dotenv = require('dotenv');
const router = require('express').Router();

const { User } = require('../models');
const spotifyApi = require('../config/spotify-config');
const {
  spotifyAuth,
  sessionAuth,
  checkSpotAuth,
} = require('../utils/spotify-auth');

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
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/callback', spotifyAuth, async (req, res) => {
  
  const currentUser = await spotifyApi.getMe();

  console.log(currentUser);

  const userExists = await User.findOne({
    where: {
      spotify_id: currentUser.body.id,
    },
  });

  if (!userExists) {
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

  console.log(currentUser.body.id);

  req.session.save(() => {
    req.session.spotAuthTok = spotifyApi._credentials.accessToken;
    req.session.spotRefTok = spotifyApi._credentials.refreshToken;
    req.session.userId = currentUser.body.id;
  });

  res.redirect(`/dashboard/${currentUser.body.id}`);
});

router.get('/playlists', spotifyAuth, async (req, res) => {
  try {
    const playlistsData = await spotifyApi.getUserPlaylists(); // how to insert userID here
    const playlists = playlistsData.body.items.map((playlist) => {
      return {
        date_created: new Date(),
        song_id: playlist.id,
        user_id: req.session.user_id,
      };
    });
    const newPlaylists = await Playlist.bulkCreate(playlists);
    res.status(200).json(newPlaylists);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
