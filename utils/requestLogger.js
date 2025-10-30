const logger = require('./logger');

function requestLogger(req, res, next) {
	const start = Date.now();
	res.on('finish', () => {
		const ms = Date.now() - start;
		logger.info({ message: `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms` });
	});
	return next();
}

module.exports = requestLogger;


