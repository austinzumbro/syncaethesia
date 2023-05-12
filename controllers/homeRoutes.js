const router = require('express').Router();
const { Playlist, User, Song } = require('../models');
const dotenv = require('dotenv');
const { sessionAuth, checkSpotAuth } = require('../utils/spotify-auth');
const spotifyApi = require('../config/spotify-config');

const Musixmatch = require('musixmatch');
const quickstart = require('../utils/cloud-test');

const msxinit = {
  apikey: process.env.MUSIXMATCH_KEY,
  baseURL: 'http://api.musixmatch.com/ws/1.1/',
  corsURL: '',
  format: 'json',
};
const msx = Musixmatch(msxinit);

const authorizeURL = process.env.AUTHORIZE_URL;

router.get('/', async (req, res) => {
  res.render('title', { authorizeURL, layout: 'title-screen' });
});

router.get('/playlists', async (req, res) => {
  res.render('playlist', { authorizeURL });
});

router.get(
  '/dashboard/:spotify_id',
  // sessionAuth,
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
            attributes: ['id', 'title', 'description'], // added description
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

        const user = currentUser.get({ plain: true });
        console.log(user.playlists[0]);

        console.log(user.spotify_id);

        console.log(req.session.spotifyId);

        res.render('dashboard', {
          user: user,
          authorizeURL,
          playlists: user.playlists,
          user_id: req.session.userId,
          spotify_id: user.spotify_id,
        });
      });

      // const user = currentUser.get({ plain: true });
      // console.log(user.playlists[0]);

      // console.log(user.spotify_id);

      // console.log(req.session.spotifyId);

      // res.render('dashboard', {
      //   user: user,
      //   authorizeURL,
      //   playlists: user.playlists,
      //   user_id: req.session.userId,
      //   spotify_id: user.spotify_id,
      // });
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

router.get(
  '/song-search',
  //sessionAuth,
  checkSpotAuth,
  (req, res) => {
    res.render('song-search', { authorizeURL });
  }
);

router.get('/playlists/:id', async (req, res) => {
  try {
    const playlistsData = await Playlist.findByPk(req.params.id, {
      include: [
        {
          model: Song,
        },
      ],
    });
    const playlist = playlistsData.get({ plain: true });
    console.log(playlist);
    res.render('playlist', {
      playlist: playlist,
      authorizeURL,
      user_id: req.session.userId,
      spotify_id: req.session.spotifyId,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/songs/:id', async (req, res) => {
  try {
    const songData = await Song.findByPk(req.params.id);
    const song = songData.get({ plain: true });

    let songLyrics = song.lyrics;

    if (!song.lyrics) {
      const response = await msx.matcherLyrics({
        q_track: song.title,
        q_artist: song.artist,
      });
      const updateSong = await Song.update(
        {
          lyrics: response.lyrics.lyrics_body,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      console.log('A song was updated.');
      console.log(updateSong);
      songLyrics = response.lyrics.lyrics_body;
    }
    console.log(songLyrics);
    let sentiment;
    try {
      const results = await quickstart(songLyrics);
      sentiment = results;
      console.log(results);
    } catch (err) {
      throw new Error(err);
    }
    console.log(req.session.spotifyId);

    res.render('song', {
      song: song,
      sentiment: sentiment,
      authorizeURL,
      user_id: req.session.userId,
      spotify_id: req.session.spotifyId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/backoff', sessionAuth, checkSpotAuth, (req, res) => {
  res.render('backoff');
});

module.exports = router;
