import { findAllBeers } from "../models/beersModel.js";

export function getAllBeers(req, res) {
	const beers = findAllBeers().map((beer) => ({
		...beer,
		links: {
			self: `/api/v1/beers/${beer.id}`,
			brewery: `/api/v1/breweries/${beer.brewery_id}`,
		},
	}));

	res.status(200).json(beers);
}
