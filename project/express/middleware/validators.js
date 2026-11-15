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
			message: "name must be 100 character or less",
		});
	}

	// style: optional text, up to 50 characters
	if (!isMissing(body.style)) {
		if (typeof body.style !== "string" || body.style.length > 50) {
			errors.push({
				field: "style",
				message: "style must be text of 50 characters or fewer",
			});
		}
	}

	// abv: optional number from 0 to 100
	if (!isMissing(body.abv)) {
		if (typeof body.abv !== "number" || body.abv < 0 || body.abv > 100) {
			errors.push({
				field: "abv",
				message: "abv must be a number from 0 to 100",
			});
		}
	}

	// release_type: optional, one of the allowed values
	if (!isMissing(body.release_type)) {
		if (!RELEASE_TYPES.includes(body.release_type)) {
			errors.push({
				field: "release_type",
				message:
					"release_type must be one of: core, seasonal, limited, one-off",
			});
		}
	}

	// aroma, flavour, notes: optional text, up to 500 characters
	const TEXT_FIELDS = ["aroma", "flavour", "notes"];
	for (const field of TEXT_FIELDS) {
		const value = body[field];
		if (!isMissing(value)) {
			if (typeof value !== "string" || value.length > 500) {
				errors.push({
					field,
					message: `${field} must be text of 500 characters or fewer`,
				});
			}
		}
	}

	// score and the three sliders: optional whole numbers from 1 to 5
	const SCALE_FIELDS = ["score", "malt", "bitterness", "hoppiness"];
	for (const field of SCALE_FIELDS) {
		const value = body[field];
		if (!isMissing(value)) {
			if (!Number.isInteger(value) || value < 1 || value > 5) {
				errors.push({
					field,
					message: `${field} must be a whole number from 1 to 5`,
				});
			}
		}
	}

	if (errors.length > 0) {
		return res.status(400).json({ status: 400, errors });
	}

	next();
}

function isMissing(value) {
	return value === undefined || value === null;
}
