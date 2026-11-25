import { useState, useEffect } from "react";
import AddBeerForm from "./AddBeerForm";

function BreweryDetail({ breweryId, onBack }) {
	const [brewery, setBrewery] = useState(null);
	const [beers, setBeers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [refreshKey, setRefreshKey] = useState(0);

	useEffect(() => {
		async function loadBrewery() {
			try {
				const breweryResponse = await fetch(`api/v1/breweries/${breweryId}`);
				if (!breweryResponse.ok) {
					throw new Error(`Server responded with ${breweryResponse.status}`);
				}
				setBrewery(await breweryResponse.json());

				const beersResponse = await fetch(
					`/api/v1/breweries/${breweryId}/beers`,
				);
				if (!beersResponse.ok) {
					throw new Error(`Server responded with ${beersResponse.status}`);
				}
				setBeers(await beersResponse.json());
				// eslint-disable-next-line no-unused-vars
			} catch (error) {
				setError("Could not load this brewery. Please try again.");
			} finally {
				setLoading(false);
			}
		}

		loadBrewery();
	}, [breweryId, refreshKey]);

	if (loading) {
		return <p>Loading brewery...</p>;
	}

	if (error) {
		return (
			<section>
				<button type="button" className="link-button" onClick={onBack}>
					← Back to breweries
				</button>
				<p className="error">{error}</p>
			</section>
		);
	}

	return (
		<section>
			<button type="button" className="link-button" onClick={onBack}>
				← Back to breweries
			</button>

			<h2>{brewery.name}</h2>
			<p>
				{brewery.brewery_type} · {brewery.city}, {brewery.country}
			</p>
			{brewery.website_url && (
				<p>
					<a href={brewery.website_url} target="_blank" rel="noreferrer">
						Visit website
					</a>
				</p>
			)}
			<p>Rating: {brewery.rating ? `${brewery.rating}/5` : "Not rated yet"}</p>
			{brewery.notes && <p>Notes: {brewery.notes}</p>}

			<h3>Beers</h3>
			{beers.length === 0 ? (
				<p>No beers logged for this brewery yet.</p>
			) : (
				<ul>
					{beers.map((beer) => (
						<li key={beer.id}>
							<strong>{beer.name}</strong>
							{beer.style && <span> · {beer.style}</span>}
							{beer.abv !== null && <span> · {beer.abv}%</span>}
							{beer.score && <span> · {beer.score}/5</span>}
						</li>
					))}
				</ul>
			)}
			<AddBeerForm
				breweryId={breweryId}
				onBeerAdded={() => setRefreshKey(refreshKey + 1)}
			/>
		</section>
	);
}

export default BreweryDetail;
