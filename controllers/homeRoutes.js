const router = require('express').Router();
const { Playlist, User } = require('../models');
const dotenv = require('dotenv');
// const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  const authorizeURL = process.env.AUTHORIZE_URL;
  res.render('title', { authorizeURL, layout: 'title-screen' });
});

router.get('/playlists', async (req, res) => {
  res.render('playlist');
});

router.get('/dashboard', async (req, res) => {
  res.render('dashboard');
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
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
  res.render('song-search');
});

module.exports = router;
