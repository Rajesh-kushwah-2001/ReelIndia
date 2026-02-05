const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/exploreController');

router.get('/', auth, c.trending);

module.exports = router;
