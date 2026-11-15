const BASE_URL = "https://api.openbrewerydb.org/v1/breweries";

export async function searchOpenBreweries(query) {
	const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=10`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Open Brewery DB responded with ${response.status}`);
	}

	return response.json();
}

export async function fetchOpenBreweryId(obdbId) {
	const response = await fetch(`${BASE_URL}/${encodeURIComponent(obdbId)}`);

	if (response.status === 404) {
		return null;
	}

	if (!response.ok) {
		throw new Error(`Open Brewery DB responded with ${response.status}`);
	}

	return response.json();
}
