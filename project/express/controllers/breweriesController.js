import { findAllBreweries, findBreweryById } from "../models/breweriesModel.js";
import { searchOpenBreweries } from "../models/openBreweryModel.js";

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
