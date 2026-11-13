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
