const spotifyApi = require('../config/spotify-config');
const dotenv = require('dotenv');

const spotifyAuth = async (req, res, next) => {
  const code = req.query.code;
  const data = await spotifyApi.authorizationCodeGrant(code);

  console.log('The token expires in ' + data.body['expires_in']);
  console.log('The access token is ' + data.body['access_token']);
  console.log('The refresh token is ' + data.body['refresh_token']);

  spotifyApi.setAccessToken(data.body['access_token']);
  spotifyApi.setRefreshToken(data.body['refresh_token']);

  req.session.save(() => {
    req.session.spotAuthTok = data.body['access_token'];
    req.session.spotRefTok = data.body['refresh_token'];
  });

  console.log(spotifyApi);

  next();
};

const sessionAuth = async (req, res, next) => {
  if (req.session.spotAuthTok && req.session.spotRefTok) {
    spotifyApi.setAccessToken(req.session.spotAuthTok);
    spotifyApi.setRefreshToken(req.session.spotRefTok);
    next();
  } else {
    next();
  }
};

const checkSpotAuth = async (req, res, next) => {
  const accessToken = spotifyApi._credentials.accessToken;
  if (!accessToken) {
    res.redirect(process.env.AUTHORIZE_URL);
    return;
  } else {
    next();
  }
};

module.exports = { spotifyAuth, sessionAuth };
