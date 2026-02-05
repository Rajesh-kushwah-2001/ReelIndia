const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../utils/upload');
const c = require('../controllers/postController');

router.post('/', auth, upload.single('media'), c.createPost);
router.get('/feed/me', auth, c.feed);
router.post('/:id/like', auth, c.toggleLikePost);
router.post('/:id/comment', auth, c.commentPost);
router.delete('/:id', auth, c.deletePost);

module.exports = router;
