const logger = require('../utils/logger');

function notFound(req, res, next) {
	res.status(404).json({ success: false, error: 'Not Found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    logger.error(`Unhandled error: ${err.message}`);
	const status = err.status || 500;
	res.status(status).json({ success: false, error: err.message || 'Server Error' });
}

module.exports = { notFound, errorHandler };


