import { findAllBreweries } from "../models/breweriesModel.js";

export function getAllBreweries(req, res) {
	const breweries = findAllBreweries().map((brewery) => ({
		...brewery,
		links: {
			self: `/api/v1/breweries/${brewery.id}`,
		},
	}));

	res.status(200).json(breweries);
}
