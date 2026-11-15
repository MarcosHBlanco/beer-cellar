import {
	findAllBeers,
	findBeerById,
	insertBeer,
} from "../models/beersModel.js";

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

export function createBeer(req, res) {
	//1. Ta=ke only the fields we know about
	const beer = {
		brewery_id: req.body.brewery_id,
		name: req.body.name.trim(),
		style: req.body.style,
		abv: req.body.abv,
		release_type: req.body.release_type,
		aroma: req.body.aroma,
		flavour: req.body.flavour,
		notes: req.body.notes,
		score: req.body.score,
		malt: req.body.malt,
		bitterness: req.body.bitterness,
		hoppiness: req.body.hoppiness,
	};

	//2. Save it
	let id;
	try {
		id = insertBeer(beer);
	} catch (error) {
		if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
			return res.status(422).json({
				status: 422,
				errors: [
					{ field: "brewery_id", message: "No brewery with that ID exists" },
				],
			});
		}
		if (error.code === "SQLITE_CONSTRAINT_CHECK") {
			return res.status(422).json({
				status: 422,
				message: "One of the values is outside its allowed range",
			});
		}
		throw error;
	}

	//3. Answer with 201 Created
	const location = `/api/v1/beers/${id}`;
	res.set("Location", location);
	res.status(201).json({
		status: 201,
		message: "Beer saved",
		beer: { id, ...beer },
		links: {
			self: location,
			brewery: `/api/v1/breweries/$(beer.brewery_id)`,
			all: "/api/v1/beers",
		},
	});
}
