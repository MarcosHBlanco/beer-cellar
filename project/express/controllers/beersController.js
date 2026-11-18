import {
	findAllBeers,
	findBeerById,
	insertBeer,
	updateBeer,
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
	//1. Using the helper to create a beer object
	const beer = beerFromBody(req.body);

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

// Builds a beer object from the request body, with only the fields we accept
function beerFromBody(body) {
	return {
		brewery_id: body.brewery_id,
		name: body.name.trim(),
		style: body.style,
		abv: body.abv,
		release_type: body.release_type,
		aroma: body.aroma,
		flavour: body.flavour,
		notes: body.notes,
		score: body.score,
		malt: body.malt,
		bitterness: body.bitterness,
		hoppiness: body.hoppiness,
	};
}

export function updateBeerById(req, res) {
	const beer = beerFromBody(req.body);

	//1. Try to update
	let changes;
	try {
		changes = updateBeer(req.params.id, beer);
	} catch (error) {
		if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
			return res.status(422).json({
				status: 422,
				errors: [
					{ field: "brewery_id", message: "no brewery with that ID exists" },
				],
			});
			throw error;
		}
	}

	//2. Nothing changed means no beer has that ID
	if (changes === 0) {
		return res.status(404).json({
			status: 404,
			message: "A beer with that ID was not found",
		});
	}

	//3. Send back the beer as it is now in the database
	const updated = findBeerById(req.params.id);
	res.status(200).json({
		...updated,
		links: {
			self: `/api/v1/beers/${updated.id}`,
			brewery: `/api/v1/breweries/${updated.brewery_id}`,
			all: "/api/v1/beers",
		},
	});
}
