const { ZodError } = require('zod');

function validate(schema) {
    return (req, res, next) => {
		try {
            const parsed = schema.parse({
                body: req.body ?? {},
                params: req.params ?? {},
                query: req.query ?? {},
            });
			req.validated = parsed;
			return next();
		} catch (err) {
			if (err instanceof ZodError) {
				const issues = err.errors || err.issues || [];
				const message = issues.length ? issues.map((e) => e.message).join(', ') : err.message;
				return res.status(400).json({ success: false, error: message });
			}
			return next(err);
		}
	};
}

module.exports = validate;


