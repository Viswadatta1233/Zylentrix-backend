const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');

function signToken(id) {
	return jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

async function signup(req, res, next) {
	try {
		const { name, email, password } = req.validated.body;
		const exists = await User.findOne({ email });
		if (exists) return res.status(409).json({ success: false, error: 'Email already registered' });
		const user = await User.create({ name, email, password });
		const token = signToken(user._id.toString());
		return res.status(201).json({ success: true, data: { token } });
	} catch (e) { return next(e); }
}

async function login(req, res, next) {
	try {
		console.log(req.validated.body);
		const { email, password } = req.validated.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
		const ok = await user.comparePassword(password);
		if (!ok) return res.status(401).json({ success: false, error: 'Invalid credentials' });
		const token = signToken(user._id.toString());
		return res.json({ success: true, data: { token } });
	} catch (e) { return next(e); }
}

async function getCurrentUser(req, res, next) {
	try {
		const user = await User.findById(req.user.id).select('-password');
		if (!user) return res.status(404).json({ success: false, error: 'User not found' });
		return res.json({ success: true, data: user });
	} catch (e) { return next(e); }
}

module.exports = { signup, login, getCurrentUser };


