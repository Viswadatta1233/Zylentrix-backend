const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
		title: { type: String, required: true, trim: true },
		description: { type: String, default: '' },
		status: { type: String, enum: ['Pending', 'In Progress', 'Done'], default: 'Pending' },
		deadline: { type: Date },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);


