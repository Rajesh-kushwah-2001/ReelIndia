const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../utils/upload');
const c = require('../controllers/reelController');

router.post('/', auth, upload.single('video'), c.createReel);
router.get('/feed', auth, c.reelsFeed);
router.post('/:id/like', auth, c.toggleLikeReel);
router.post('/:id/comment', auth, c.commentReel);
router.post('/:id/view', auth, c.addView);

module.exports = router;
