const { getRedis } = require('../config/redis');

async function getTasksCacheKey(userId) {
	return `tasks:${userId}`;
}

async function cacheUserTasks(userId, data) {
	const client = await getRedis();
	const key = await getTasksCacheKey(userId);
	await client.set(key, JSON.stringify(data), { EX: 60 });
}

async function getCachedUserTasks(userId) {
	const client = await getRedis();
	const key = await getTasksCacheKey(userId);
	const raw = await client.get(key);
	return raw ? JSON.parse(raw) : null;
}

async function invalidateUserTasks(userId) {
	const client = await getRedis();
	const key = await getTasksCacheKey(userId);
	await client.del(key);
}

module.exports = { cacheUserTasks, getCachedUserTasks, invalidateUserTasks };


