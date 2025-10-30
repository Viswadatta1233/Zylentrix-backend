const { z } = require('zod');

const signupSchema = z.object({
	body: z.object({
		name: z.string().min(2),
		email: z.string().email(),
		password: z.string().min(6),
	}),
});

const loginSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: z.string().min(6),
	}),
});

const createTaskSchema = z.object({
	body: z.object({
		title: z.string().min(1),
		description: z.string().optional().default(''),
		status: z.enum(['Pending', 'In Progress', 'Done']).optional(),
		deadline: z.string().datetime().optional(),
	}),
});

const createTasksBulkSchema = z.object({
    body: z.object({
        tasks: z
            .array(
                z.object({
                    title: z.string().min(1),
                    description: z.string().optional().default(''),
                    status: z.enum(['Pending', 'In Progress', 'Done']).optional(),
                    deadline: z.string().datetime().optional(),
                })
            )
            .min(1)
            .max(100),
    }),
});

const updateTaskSchema = z.object({
	params: z.object({ id: z.string().length(24) }),
	body: z.object({
		title: z.string().min(1).optional(),
		description: z.string().optional(),
		status: z.enum(['Pending', 'In Progress', 'Done']).optional(),
		deadline: z.string().datetime().optional().or(z.null()),
	}),
});

const idParamSchema = z.object({ params: z.object({ id: z.string().length(24) }) });

module.exports = { signupSchema, loginSchema, createTaskSchema, createTasksBulkSchema, updateTaskSchema, idParamSchema };


