const { createClient } = require('redis');
const env = require('./env');
const logger = require('../utils/logger');

let client;

async function getRedis() {
	if (client) return client;
	client = createClient({ url: env.redisUrl });
	client.on('error', (err) => logger.error(`Redis error: ${err.message}`));
	await client.connect();
	logger.info('Redis connected');
	return client;
}

module.exports = { getRedis };


