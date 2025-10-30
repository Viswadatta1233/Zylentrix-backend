const rateLimit = require('express-rate-limit');

function loginRateLimiter() {
    return rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            res.status(429).json({ success: false, error: 'Too many login attempts. Try later.' });
        },
    });
}

module.exports = { loginRateLimiter };


