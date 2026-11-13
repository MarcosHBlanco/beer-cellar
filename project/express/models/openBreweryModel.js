const BASE_URL = "https://api.openbrewerydb.org/v1/breweries";

export async function searchOpenBreweries(query) {
	const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=10`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Open Brewery DB responded with ${response.status}`);
	}

	return response.json();
}
