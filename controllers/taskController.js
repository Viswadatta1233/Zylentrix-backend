const Task = require('../models/Task');
const { cacheUserTasks, getCachedUserTasks, invalidateUserTasks } = require('../utils/cache');

async function listTasks(req, res, next) {
	try {
		const cached = await getCachedUserTasks(req.user.id);
		if (cached) return res.json({ success: true, data: cached, cached: true });
		const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
		await cacheUserTasks(req.user.id, tasks);
		return res.json({ success: true, data: tasks });
	} catch (e) { return next(e); }
}

async function createTask(req, res, next) {
	try {
		const { title, description, status, deadline } = req.validated.body;
		const task = await Task.create({ user: req.user.id, title, description, status, deadline });
		await invalidateUserTasks(req.user.id);
		return res.status(201).json({ success: true, data: task });
	} catch (e) { return next(e); }
}

async function updateTask(req, res, next) {
	try {
		const { id } = req.validated.params;
		const updates = req.validated.body;
		const task = await Task.findOneAndUpdate({ _id: id, user: req.user.id }, updates, { new: true });
		if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
		await invalidateUserTasks(req.user.id);
		return res.json({ success: true, data: task });
	} catch (e) { return next(e); }
}

async function deleteTask(req, res, next) {
	try {
		const { id } = req.validated.params;
		const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
		if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
		await invalidateUserTasks(req.user.id);
		return res.status(204).send();
	} catch (e) { return next(e); }
}

async function createTasksBulk(req, res, next) {
    try {
        const { tasks } = req.validated.body;
        const docs = tasks.map((t) => ({
            user: req.user.id,
            title: t.title,
            description: t.description || '',
            status: t.status,
            deadline: t.deadline,
        }));
        const created = await Task.insertMany(docs);
        await invalidateUserTasks(req.user.id);
        return res.status(201).json({ success: true, data: created });
    } catch (e) { return next(e); }
}

module.exports = { listTasks, createTask, createTasksBulk, updateTask, deleteTask };


