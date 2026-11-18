import { findBeersByBreweryId } from "../models/beersModel.js";
import {
	findAllBreweries,
	findBreweryById,
	insertBrewery,
	updateBreweryReview,
} from "../models/breweriesModel.js";
import {
	fetchOpenBreweryId,
	searchOpenBreweries,
} from "../models/openBreweryModel.js";

export function getAllBreweries(req, res) {
	const breweries = findAllBreweries().map((brewery) => ({
		...brewery,
		links: {
			self: `/api/v1/breweries/${brewery.id}`,
			beers: `/api/v1/breweries/${brewery.id}/beers`,
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
			beers: `/api/v1/breweries/${brewery.id}/beers`,
			all: "/api/v1/breweries",
		},
	});
}

export async function searchBreweries(req, res) {
	try {
		const results = await searchOpenBreweries(req.query.query);

		const breweries = results.map((brewery) => ({
			obdb_id: brewery.id,
			name: brewery.name,
			brewery_type: brewery.brewery_type,
			city: brewery.city,
			state_province: brewery.state_province,
			country: brewery.country,
			website_url: brewery.website_url,
		}));

		res.status(200).json(breweries);
	} catch (error) {
		res.status(502).json({
			status: 502,
			message: "Could not reach Open Brewery DB. Please try again later.",
		});
	}
}

export async function createBrewery(req, res) {
	//1. Look the brewery up in Open Brewery DB
	let found;
	try {
		found = await fetchOpenBreweryId(req.body.obdb_id);
	} catch (error) {
		console.error("Lookup failed:", error);
		return res.status(502).json({
			status: 502,
			message: "Could not reach Open Brewery DB. Please try again later",
		});
	}

	if (!found) {
		return res.status(404).json({
			status: 404,
			message: "No brewery with that obdb_id exists in Open Brewery DB",
		});
	}

	//2. Keep only the fields our database stores
	const brewery = {
		obdb_id: found.id,
		name: found.name,
		brewery_type: found.brewery_type,
		city: found.city,
		state_province: found.state_province,
		country: found.country,
		website_url: found.website_url,
	};

	//3. Save it
	let id;
	try {
		id = insertBrewery(brewery);
	} catch (error) {
		if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
			return res.status(409).json({
				status: 409,
				message: "This brewery is already saved",
			});
		}
		throw error;
	}

	//4. Answer with 201 Created
	const location = `/api/v1/breweries/${id}`;
	res.set("Location", location);
	res.status(201).json({
		status: 201,
		message: "Brewery saved",
		brewery: { id, ...brewery },
		links: {
			self: location,
			all: "/api/v1/breweries",
		},
	});
}

export function getBeersForBrewery(req, res) {
	//1. Does the brewery exist?
	const brewery = findBreweryById(req.params.id);
	if (!brewery) {
		return res.status(404).json({
			status: 404,
			message: "A brewery with that ID was not found",
		});
	}

	//2. Get its beers (may be empty list)
	const beers = findBeersByBreweryId(brewery.id).map((beer) => ({
		...beer,
		links: {
			self: `/api/v1/beers/${beer.id}`,
		},
	}));

	res.status(200).json(beers);
}

export function updateBreweryById(req, res) {
	const changes = updateBreweryReview(
		req.params.id,
		req.body.rating,
		req.body.notes,
	);

	if (changes === 0) {
		return res.status(404).json({
			status: 404,
			message: "A brewery with that ID was not found",
		});
	}

	const updated = findBreweryById(req.params.id);
	res.status(200).json({
		...updated,
		links: {
			self: `/api/v1/breweries/${updated.id}`,
			beers: `/api/v1/breweries/${updated.id}/beers`,
			all: "/api/v1/breweries",
		},
	});
}
