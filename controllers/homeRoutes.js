const router = require('express').Router();
const { Playlist, User } = require('../models');
// const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  res.render('homepage', {
    spotifyUrl: `https://accounts.spotify.com/en/authorize?client_id=1074de05714444ac97db883503762249&response_type=code&redirect_uri=http://localhost:3001&show_dialog=true&scope=user-read-private%20user-read-email%20user-modify-playback-state%20user-read-playback-position%20user-library-read%20streaming%20user-read-playback-state%20user-read-recently-played%20playlist-read-private`,
  });
});

router.get('/dashboard', async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Playlist }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
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

router.get('/callback', async (req, res) => {
  const code = req.query.code;
  const data = await spotifyApi.authorizationCodeGrant(code);

  console.log('The token expires in ' + data.body['expires_in']);
  console.log('The access token is ' + data.body['access_token']);
  console.log('The refresh token is ' + data.body['refresh_token']);

  spotifyApi.setAccessToken(data.body['access_token']);
  spotifyApi.setRefreshToken(data.body['refresh_token']);



  res.redirect('/');
}

module.exports = router;


