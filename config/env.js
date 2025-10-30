require('dotenv').config();

const getEnv = () => {
	const required = ['MONGODB_URI', 'JWT_SECRET'];
	const missing = required.filter((k) => !process.env[k]);
	if (missing.length) {
		throw new Error(`Missing required env vars: ${missing.join(', ')}`);
	}
	return {
		nodeEnv: process.env.NODE_ENV || 'development',
		port: parseInt(process.env.PORT || '4000', 10),
		mongoUri: process.env.MONGODB_URI,
		jwtSecret: process.env.JWT_SECRET,
		jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
		corsOrigin: (process.env.CORS_ORIGIN || '*')
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s.length) ,
		redisUrl: process.env.REDIS_URL || 'redis://red-d41nnj75r7bs739l7r40:6379',
		notificationWebhookUrl: process.env.NOTIFICATION_WEBHOOK_URL || '',
	};
};

module.exports = getEnv();


