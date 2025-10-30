const express = require('express');
const { signup, login, getCurrentUser } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../utils/schemas');
const { loginRateLimiter } = require('../middleware/rateLimit');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', loginRateLimiter(), validate(loginSchema), login);
router.get('/me', auth, getCurrentUser);

module.exports = router;


