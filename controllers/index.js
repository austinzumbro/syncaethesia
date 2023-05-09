const router = require('express').Router();

// const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const musixMatchRoutes = require('./musixMatchRoutes');

router.use('/', homeRoutes);
// router.use('/api', apiRoutes);
router.use('/musixmatch', musixMatchRoutes);

module.exports = router;
