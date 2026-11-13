import { findAllBeers, findBeerById } from "../models/beersModel.js";

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

export function getBeerById(req, res) {
	const beer = findBeerById(req.params.id);

	if (!beer) {
		return res.status(404).json({
			status: 404,
			message: "A beer with that ID was not found",
		});
	}

	res.status(200).json({
		...beer,
		links: {
			self: `/api/v1/beers/${beer.id}`,
			brewery: `/api/v1/breweries/${beer.brewery_id}`,
			all: "/api/v1/beers",
		},
	});
}
