const router = require('express').Router();
const { Playlist, User, Song } = require('../models');
const dotenv = require('dotenv');
const { sessionAuth, checkSpotAuth } = require('../utils/spotify-auth');
const spotifyApi = require('../config/spotify-config');

const authorizeURL = process.env.AUTHORIZE_URL;

router.get('/', async (req, res) => {
  res.render('title', { authorizeURL, layout: 'title-screen' });
});

router.get('/playlists', async (req, res) => {
  res.render('playlist', { authorizeURL });
});

router.get(
  '/dashboard/:spotify_id',
  sessionAuth,
  checkSpotAuth,
  async (req, res) => {
    try {
      const currentUser = await User.findOne({
        where: {
          spotify_id: req.params.spotify_id,
        },
        include: [
          {
            model: Playlist,
            include: [
              {
                model: Song, 
                attributes: ['title', 'artist'],
                // limit: 10 , // limit # of tracks retrieved
              },
            ],
            attributes: ['title', 'description'], // added description
          },
        ],
      });

      console.log(currentUser.id);
      console.log(currentUser);

      req.session.save(() => {
        req.session.userId = currentUser.id;
        req.session.spotifyId = currentUser.spotify_id;
        req.session.spotAuthTok = spotifyApi._credentials.accessToken;
        req.session.spotRefTok = spotifyApi._credentials.refreshToken;
      });

      const user = currentUser.get({ plain: true });
      console.log(user.playlists[0]);

      res.render('dashboard', {
        user: user,
        authorizeURL,
        playlists: user.playlists,
        user_id: req.session.userId,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard', { authorizeURL });
    return;
  }

  res.render('login');
});

router.get('/mmtest', (req, res) => {
  res.render('mmtest');
});

router.get('/spotify-test', (req, res) => {
  res.render('homepage', { layout: 'spotify-test' });
});

router.get('/song-search', sessionAuth, checkSpotAuth, (req, res) => {
  res.render('song-search', { authorizeURL });
});

router.get('/playlists/:id', async(req, res) => {
  try{
    const playlistsData = await Playlist.findByPk(req.params.id, {
      include: [{
        model: Song,
      }]
    });
    const playlist = playlistsData.get({ plain: true });
    res.render('playlist', {
      playlist: playlist,
      authorizeURL,
      user_id: req.session.userId,
    })
  } catch (err){
    res.status(500).json(err);
  }
});

router.get('/songs/:id', async(req, res) => {
  try{
    const songData = await Song.findByPk(req.params.id);
    const song = songData.get({ plain: true });
    res.render('song', {
      song: song,
      authorizeURL,
      user_id: req.session.userId,
    })
  } catch (err){
    res.status(500).json(err);
  }
});

module.exports = router;
