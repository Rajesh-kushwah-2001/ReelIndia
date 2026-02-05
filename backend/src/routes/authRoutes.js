const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const c = require('../controllers/authController');

router.post('/signup', [body('email').isEmail(), body('password').isLength({ min: 6 }), body('username').isLength({ min: 3 })], c.signup);
router.post('/login', c.login);
router.get('/me', auth, c.me);

module.exports = router;
