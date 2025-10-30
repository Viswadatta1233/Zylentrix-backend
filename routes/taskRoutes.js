const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createTaskSchema, createTasksBulkSchema, updateTaskSchema, idParamSchema } = require('../utils/schemas');
const { listTasks, createTask, createTasksBulk, updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

router.get('/', auth, listTasks);
router.post('/', auth, validate(createTaskSchema), createTask);
router.post('/bulk', auth, validate(createTasksBulkSchema), createTasksBulk);
router.put('/:id', auth, validate(updateTaskSchema), updateTask);
router.delete('/:id', auth, validate(idParamSchema), deleteTask);

module.exports = router;


