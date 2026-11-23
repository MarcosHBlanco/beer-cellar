import { useState, useEffect } from "react";

function BreweryList({ onSelect, refreshKey }) {
	const [breweries, setBreweries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function loadBreweries() {
			try {
				const response = await fetch("/api/v1/breweries");
				if (!response.ok) {
					throw new Error(`Server responded with ${response.status}`);
				}
				const data = await response.json();
				setBreweries(data);
				// eslint-disable-next-line no-unused-vars
			} catch (err) {
				setError("Could not load breweries. Is the server running?");
			} finally {
				setLoading(false);
			}
		}

		loadBreweries();
	}, [refreshKey]);

	if (loading) {
		return <p>Loading breweries...</p>;
	}

	if (error) {
		return <p className="error">{error}</p>;
	}

	if (breweries.length === 0) {
		return <p>No breweries saved yet.</p>;
	}

	return (
		<section>
			<h2>My Breweries</h2>
			<ul>
				{breweries.map((brewery) => (
					<li key={brewery.id}>
						<button onClick={() => onSelect(brewery.id)}>
							<strong>{brewery.name}</strong> . {brewery.city}
							{brewery.rating && <span> . {brewery.rating}/5</span>}
						</button>
					</li>
				))}
			</ul>
		</section>
	);
}

export default BreweryList;
