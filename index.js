const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const env = require('./config/env');
const { connectDB } = require('./config/db');
const { getRedis } = require('./config/redis');
const logger = require('./utils/logger');
const requestLogger = require('./utils/requestLogger');
const { startDeadlineNotifier } = require('./utils/scheduler');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/error');

async function bootstrap() {
	await connectDB();
	await getRedis();
	const app = express();
	app.use(helmet());
	app.use(cors({ origin: env.corsOrigin.length === 1 && env.corsOrigin[0] === '*' ? '*' : env.corsOrigin }));
	app.use(express.json({ limit: '200kb' }));
	app.use(requestLogger);

	app.get('/health', (req, res) => res.json({ ok: true }));
	app.use('/api/auth', authRoutes);
	app.use('/api/tasks', taskRoutes);

	app.use(notFound);
	app.use(errorHandler);

	app.listen(env.port, () => {
		logger.info({ message: `Server listening on :${env.port}` });
	});

	startDeadlineNotifier();
}

bootstrap().catch((e) => {
	logger.error({ message: 'Fatal bootstrap error', err: e.message });
	process.exit(1);
});