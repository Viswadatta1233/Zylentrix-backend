const cron = require('node-cron');
const Task = require('../models/Task');
const env = require('../config/env');
const logger = require('./logger');

function startDeadlineNotifier() {
	if (!env.notificationWebhookUrl) {
		logger.info({ message: 'Notification webhook not configured; skipping scheduler' });
		return;
	}
	cron.schedule('*/5 * * * *', async () => {
		try {
			const now = new Date();
			const upcoming = new Date(now.getTime() + 15 * 60 * 1000);
			const tasks = await Task.find({ deadline: { $gte: now, $lte: upcoming } }).limit(50);
			if (!tasks.length) return;
			await fetch(env.notificationWebhookUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ type: 'DEADLINE_WINDOW', tasks }),
			});
			logger.info({ message: `Notified deadlines for ${tasks.length} tasks` });
		} catch (e) {
			logger.error({ message: 'Scheduler error', err: e.message });
		}
	});
}

module.exports = { startDeadlineNotifier };


