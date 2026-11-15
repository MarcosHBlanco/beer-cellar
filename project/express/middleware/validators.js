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

export function validateBreweryBody(req, res, next) {
	const body = req.body || {};
	const obdbId = body.obdb_id;

	if (typeof obdbId !== "string" || obdbId.trim() === "") {
		return res.status(400).json({
			status: 400,
			errors: [{ field: "obdb_id", message: "obdb_id is required" }],
		});
	}

	next();
}

export function validateBeerBody(req, res, next) {
	const body = req.body || {};
	const errors = [];

	//brewery_id: required, a whole number from 1 up
	if (!Number.isInteger(body.brewery_id) || body.brewery_id < 1) {
		errors.push({
			field: "brewery_id",
			message: "brewery_id must be a positive whole number",
		});
	}

	//name: required text, 1 to 100 characters
	if (typeof body.name !== "string" || body.name.trim() === "") {
		errors.push({ field: "name", message: "name is required" });
	} else if (body.name.trim().length > 100) {
		errors.push({
			field: "name",
			message: "name mjst be 100 character or less",
		});
	}

	if (errors.length > 0) {
		return res.status(400).json({ status: 400, errors });
	}

	next();
}
