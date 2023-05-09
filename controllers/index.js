const router = require('express').Router();

// const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const musixMatchRoutes = require('./musixMatchRoutes');
const spotifyRoutes = require('./spotifyRoute');
const apiRoutes = require('./api');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/musixmatch', musixMatchRoutes);
router.use('/spotify', spotifyRoutes);

module.exports = router;
