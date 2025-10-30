const jwt = require('jsonwebtoken');
const env = require('../config/env');

function auth(req, res, next) {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : null;
	if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });
	try {
		const payload = jwt.verify(token, env.jwtSecret);
		req.user = { id: payload.id };
		return next();
	} catch (e) {
		return res.status(401).json({ success: false, error: 'Invalid token' });
	}
}

module.exports = auth;


