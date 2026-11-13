export function validateId(req, res, next) {
	const id = Number(req.params.id);

	if (!Number.isInteger(id) || id < 1) {
		return res.status(400).json({
			status: 400,
			message: "ID must be a positive whole number",
		});
	}

	next();
}

const RELEASE_TYPES = ["core", "seasonal", "limited", "one-off"];

export function validateBeerQuery(req, res, next) {
	const errors = [];

	if (req.query.page !== undefined) {
		const page = Number(req.query.page);
		if (!Number.isInteger(page) || page < 0) {
			errors.push({
				field: "page",
				message: "page must be a whole number, 0 or higher",
			});
		}
	}

	if (req.query.release_type !== undefined) {
		if (!RELEASE_TYPES.includes(req.query.release_type)) {
			errors.push({
				field: "release_type",
				message:
					"release_type must be one of: core, seasonal, limited, one-off",
			});
		}
	}

	if (errors.length > 0) {
		return res.status(400).json({ status: 400, errors });
	}

	next();
}

export function validateSearchQuery(req, res, next) {
	const query = req.query.query;

	if (typeof query !== "string" || query.trim().length < 2) {
		return res.status(400).json({
			status: 400,
			errors: [
				{
					field: "query",
					message: "query must be at least 2 characters",
				},
			],
		});
	}

	next();
}
