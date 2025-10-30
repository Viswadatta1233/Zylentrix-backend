const { createClient } = require('redis');
const env = require('./env');
const logger = require('../utils/logger');

let client;

async function getRedis() {
	if (client) return client;
    const url = new URL(env.redisUrl);
    const useTls = url.protocol === 'rediss:' || String(process.env.REDIS_TLS).toLowerCase() === 'true';
    client = createClient({ url: env.redisUrl, socket: useTls ? { tls: true } : undefined });
    client.on('error', (err) => {
        const msg = err && err.message ? err.message : JSON.stringify(err);
        logger.error(`Redis error: ${msg}`);
    });
	await client.connect();
    logger.info('Redis connected');
	return client;
}

module.exports = { getRedis };


