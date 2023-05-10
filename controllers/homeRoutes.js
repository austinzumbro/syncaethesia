const router = require('express').Router();
const { Playlist, User } = require('../models');
const dotenv = require('dotenv');
// const withAuth = require('../utils/auth');

const authorizeURL = process.env.AUTHORIZE_URL;

router.get('/', async (req, res) => {
  res.render('title', { authorizeURL, layout: 'title-screen' });
});

router.get('/playlists', async (req, res) => {
  res.render('playlist', { authorizeURL });
});

router.get('/dashboard', async (req, res) => {
  res.render('dashboard', { authorizeURL });
});

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

router.get('/song-search', (req, res) => {
  res.render('song-search', { authorizeURL });
});

module.exports = router;
