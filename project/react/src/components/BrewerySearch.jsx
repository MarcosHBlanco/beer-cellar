import { useState } from "react";

function BrewerySearch({ onBrewerySaved }) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [hasSearched, setHasSearched] = useState(false);
	const [searching, setSearching] = useState(false);
	const [savingId, setSavingId] = useState(null);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	async function handleSearch(event) {
		event.preventDefault();
		setSearching(true);
		setMessage("");
		setError("");

		try {
			const response = await fetch(
				`/api/v1/breweries/search?query=${encodeURIComponent(query)}`,
			);
			const data = await response.json();

			if (response.ok) {
				setResults(data);
				setHasSearched(true);
			} else {
				setError(data.errors ? data.errors[0].message : data.message);
			}
			// eslint-disable-next-line no-unused-vars
		} catch (err) {
			setError("Could not reach the server. Please try again");
		} finally {
			setSearching(false);
		}
	}

	async function handleSave(brewery) {
		setSavingId(brewery.obdb_id);
		setMessage("");
		setError("");

		try {
			const response = await fetch("/api/v1/breweries", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ obdb_id: brewery.obdb_id }),
			});
			const data = await response.json();

			if (response.ok) {
				setMessage(`${brewery.name} was saved to your cellar!`);
				onBrewerySaved();
			} else if (response.status === 409) {
				setMessage(`${brewery.name} is already in your cellar.`);
			} else {
				setError(data.errors ? data.errors[0].message : data.message);
			}
			// eslint-disable-next-line no-unused-vars
		} catch (err) {
			setError("Could not reach the server. Please try again.");
		} finally {
			setSavingId(null);
		}
	}

	return (
		<section>
			<h2>Find a brewery</h2>

			<form onSubmit={handleSearch}>
				<label>
					Search by name
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
					/>
				</label>
				<button type="submit" disabled={searching}>
					{searching ? "Searching..." : "Search"}
				</button>
			</form>

			{message && <p className="success">{message}</p>}
			{error && <p className="error">{error}</p>}

			{hasSearched && results.length === 0 && (
				<p>No breweries found. try another name.</p>
			)}

			{results.length > 0 && (
				<ul>
					{results.map((brewery) => (
						<li key={brewery.obdb_id}>
							<strong>{brewery.name}</strong> · {brewery.city},{" "}
							{brewery.country}
							<button
								type="button"
								onClick={() => handleSave(brewery)}
								disabled={savingId !== null}
							>
								{savingId === brewery.obdb_id ? "Saving..." : "Save"}
							</button>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}

export default BrewerySearch;
