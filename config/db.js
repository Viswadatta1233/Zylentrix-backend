const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

async function connectDB() {
	const uri = env.mongoUri;
	mongoose.set('strictQuery', true);
	await mongoose.connect(uri);
	logger.info('MongoDB connected');
}

module.exports = { connectDB };


