const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const env = require('../config/env');

const logFmt = format.printf(({ level, message, timestamp, ...meta }) => {
	const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
	return `${timestamp} [${level}] ${message}${metaStr}`;
});

const logger = createLogger({
	level: env.nodeEnv === 'production' ? 'info' : 'debug',
	format: format.combine(format.timestamp(), format.errors({ stack: true }), logFmt),
	transports: [
		new transports.Console({ handleExceptions: true }),
		new DailyRotateFile({ filename: 'logs/app-%DATE%.log', datePattern: 'YYYY-MM-DD', maxFiles: '14d' }),
	],
});

module.exports = logger;


