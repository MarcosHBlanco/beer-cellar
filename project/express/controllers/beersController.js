import { findAllBeers } from "../models/beersModel.js";

const PAGE_SIZE = 5;

export function getAllBeers(req, res) {
	const page = Number(req.query.page) || 0;
	const offset = page * PAGE_SIZE;

	const beers = findAllBeers(PAGE_SIZE, offset, req.query.release_type).map(
		(beer) => ({
			...beer,
			links: {
				self: `/api/v1/beers/${beer.id}`,
				brewery: `/api/v1/breweries/${beer.brewery_id}`,
			},
		}),
	);

	res.status(200).json(beers);
}
