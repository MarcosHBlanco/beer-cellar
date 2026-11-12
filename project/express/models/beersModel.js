import db from "../database/db.js";

export function findAllBeers() {
	const stmt = db.prepare(`
    SELECT
      beers.id,
      beers.name,
      beers.style,
      beers.abv,
      beers.release_type,
      beers.score,
      beers.brewery_id,
      breweries.name AS brewery_name
    FROM beers
    JOIN breweries ON beers.brewery_id = breweries.id
    ORDER BY beers.name
  `);
	return stmt.all();
}
