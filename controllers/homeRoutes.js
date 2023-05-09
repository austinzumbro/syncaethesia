const router = require('express').Router();
const { Playlist, User } = require('../models');
// const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  res.render('homepage');
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

module.exports = router;
