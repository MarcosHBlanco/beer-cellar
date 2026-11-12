import { findAllBreweries, findBreweryById } from "../models/breweriesModel.js";

export function getAllBreweries(req, res) {
	const breweries = findAllBreweries().map((brewery) => ({
		...brewery,
		links: {
			self: `/api/v1/breweries/${brewery.id}`,
		},
	}));

	res.status(200).json(breweries);
}

export function getBreweryById(req, res) {
	const brewery = findBreweryById(req.params.id);

	if (!brewery) {
		return res.status(404).json({
			status: 404,
			message: "A brewery with that ID was not found",
		});
	}

	res.status(200).json({
		...brewery,
		links: {
			self: `/api/v1/breweries/${brewery.id}`,
			all: "/api/v1/breweries",
		},
	});
}
