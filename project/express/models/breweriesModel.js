import db from "../database/db.js";

export function findAllBreweries() {
	const stmt = db.prepare(`
    SELECT id, name, brewery_type, city, country, rating
    FROM breweries
    ORDER BY name
  `);
	return stmt.all();
}
