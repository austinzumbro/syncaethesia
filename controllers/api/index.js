const router = require('express').Router();
const { User, Playlist, Song, Friend } = require('../../models');

const userRoutes = require('./userRoutes');
const playlistRoutes = require('./playlistRoutes');
const songRoutes = require('./songRoutes');

router.use('/users', userRoutes);
router.use('/playlists', playlistRoutes);
router.use('/songs', songRoutes);

module.exports = router;
