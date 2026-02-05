const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../utils/upload');
const c = require('../controllers/userController');

router.get('/:id', auth, c.getProfile);
router.patch('/profile/me', auth, upload.single('profilePhoto'), c.updateProfile);
router.post('/follow/:id', auth, c.followToggle);

module.exports = router;
