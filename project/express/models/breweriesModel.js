import db from "../database/db.js";

export function findAllBreweries() {
	const stmt = db.prepare(`
    SELECT id, name, brewery_type, city, country, rating
    FROM breweries
    ORDER BY name
  `);
	return stmt.all();
}

export function findBreweryById(id) {
	const stmt = db.prepare("SELECT * FROM breweries WHERE id = ?");
	return stmt.get(id);
}

export function insertBrewery(brewery) {
	const stmt = db.prepare(`
    INSERT INTO breweries (obdb_id, name, brewery_type, city, state_province, country, website_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

	const result = stmt.run(
		brewery.obdb_id,
		brewery.name,
		brewery.brewery_type,
		brewery.city,
		brewery.state_province,
		brewery.country,
		brewery.website_url,
	);

	return result.lastInsertRowid;
}
