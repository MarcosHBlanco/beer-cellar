import db from "../database/db.js";

export function findAllBeers(limit, offset, releaseType) {
	let sql = `
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
  `;

	const values = [];

	if (releaseType) {
		sql += " WHERE beers.release_type = ?";
		values.push(releaseType);
	}

	sql += " ORDER BY beers.name LIMIT ? OFFSET ?";
	values.push(limit, offset);

	return db.prepare(sql).all(...values);
}
